import { MeterPhase, PanelTech } from './types';

export interface SolarCalculationInput {
  panelWattage: number;      // e.g. 580 (Wp)
  panelQuantity: number;     // e.g. 8
  meterPhase: MeterPhase;    // 'Single Phase' | 'Three Phase'
  panelTech: PanelTech;      // 'Polycrystalline' | 'Monocrystalline' | 'Bi-facial' | 'Topcon'
  grossCost: number;         // e.g. 230000
  stateSubsidy?: number;     // Optional state subsidy (default 0)
  tariffPerUnit?: number;    // Default 7.50 Rs/kWh
}

export interface SolarCalculationOutput {
  plantCapacityKw: number;
  meterCharges: number;
  centralSubsidy: number;
  stateSubsidy: number;
  totalSubsidy: number;
  netCustomerCost: number;
  firstPayment80: number;
  finalPayment20: number;
  annualGenerationKwh: number;
  annualSavingsRs: number;
  paybackPeriodYears: number;
  co2ReductionTonnes: number;
  treesSavedAnnually: number;
}

export class SolarCalculator {
  private static readonly DEFAULT_TARIFF = 7.50;
  private static readonly CO2_FACTOR = 0.85; // 0.85 kg CO2 per kWh
  private static readonly TREE_ABSORPTION_FACTOR = 21.77; // 21.77 kg CO2 per tree per year

  public static calculate(input: SolarCalculationInput): SolarCalculationOutput {
    // 1. Plant Capacity (kW) = (Wattage * Quantity) / 1000
    const plantCapacityKw = Number(((input.panelWattage * input.panelQuantity) / 1000).toFixed(3));

    // 2. DISCOM Meter Charges
    const meterCharges = input.meterPhase === 'Single Phase' ? 2950 : 4950;

    // 3. Central Subsidy (PM Surya Ghar Muft Bijli Yojana)
    // - Up to 2 kW: Rs 30,000 per kW (max Rs 60,000)
    // - From 2.01 to 3 kW: Rs 18,000 for the 3rd kW (capped at Rs 18,000)
    // - Total maximum central subsidy = Rs 78,000
    let tier1Subsidy = 0;
    if (plantCapacityKw > 0) {
      tier1Subsidy = plantCapacityKw <= 2 ? 30000 * plantCapacityKw : 60000;
    }

    let tier2Subsidy = 0;
    if (plantCapacityKw > 2) {
      const extraKw = Math.min(plantCapacityKw - 2, 1);
      tier2Subsidy = 18000 * extraKw;
    }

    const centralSubsidy = Math.round(tier1Subsidy + tier2Subsidy);
    const stateSubsidy = Math.round(input.stateSubsidy || 0);
    const totalSubsidy = centralSubsidy + stateSubsidy;

    // 4. Net Cost to Customer
    const netCustomerCost = Math.max(0, input.grossCost - totalSubsidy);

    // 5. Payment Milestones (80% / 20%)
    const firstPayment80 = Math.round(input.grossCost * 0.8);
    const finalPayment20 = input.grossCost - firstPayment80;

    // 6. Annual Generation (kWh)
    let dailyUnitsPerKw = 3.8;
    if (input.panelTech === 'Monocrystalline') {
      dailyUnitsPerKw = 4.2;
    } else if (input.panelTech === 'Bi-facial' || input.panelTech === 'Topcon') {
      dailyUnitsPerKw = 4.5;
    }
    const annualGenerationKwh = Number((plantCapacityKw * dailyUnitsPerKw * 365).toFixed(2));

    // 7. Annual Monetary Savings & Payback Period
    const tariff = input.tariffPerUnit ?? this.DEFAULT_TARIFF;
    const annualSavingsRs = Number((annualGenerationKwh * tariff).toFixed(2));
    const paybackPeriodYears = annualSavingsRs > 0
      ? Number((netCustomerCost / annualSavingsRs).toFixed(2))
      : 0;

    // 8. Environmental Metrics
    const co2ReductionTonnes = Math.round((annualGenerationKwh * this.CO2_FACTOR) / 1000);
    const treesSavedAnnually = Math.round((co2ReductionTonnes * 1000) / this.TREE_ABSORPTION_FACTOR);

    return {
      plantCapacityKw,
      meterCharges,
      centralSubsidy,
      stateSubsidy,
      totalSubsidy,
      netCustomerCost,
      firstPayment80,
      finalPayment20,
      annualGenerationKwh,
      annualSavingsRs,
      paybackPeriodYears,
      co2ReductionTonnes,
      treesSavedAnnually,
    };
  }
}

