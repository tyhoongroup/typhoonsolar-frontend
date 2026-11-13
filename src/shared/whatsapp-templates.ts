export class WhatsAppTemplates {
  private static sanitizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    return digits.startsWith('91') ? digits : `91${digits}`;
  }

  // 1. Quotation Proposal (Screen 19, 30)
  static buildQuotationMessage(params: {
    customerPhone: string;
    customerName: string;
    systemKw: number;
    netCost: number;
    trackingUrl: string;
  }): string {
    const formattedCost = new Intl.NumberFormat('en-IN').format(params.netCost);
    const text =
      `Hello ${params.customerName} ji,\n\n` +
      `Greetings from *Typhoon Solar*! ☀️\n\n` +
      `We have prepared your customized solar rooftop proposal:\n` +
      `⚡ *System Capacity:* ${params.systemKw} kW\n` +
      `💵 *Net Cost (After PM Surya Ghar Subsidy):* ₹${formattedCost}\n\n` +
      `📄 Click the link below to view your full proposal & specifications:\n${params.trackingUrl}\n\n` +
      `Please let us know if you have any questions!\n` +
      `*Typhoon Solar Solutions*`;

    return `https://wa.me/${this.sanitizePhone(params.customerPhone)}?text=${encodeURIComponent(text)}`;
  }

  // 2. Material Unload Scheduled (Screen 33)
  static buildMaterialUnloadMessage(params: {
    customerPhone: string;
    customerName: string;
    unloadDate: string;
    amountDue: number;
  }): string {
    const formattedAmount = new Intl.NumberFormat('en-IN').format(params.amountDue);
    const text =
      `Hello ${params.customerName} ji,\n\n` +
      `Your Typhoon Solar rooftop materials are scheduled to be unloaded on *${params.unloadDate}*.\n\n` +
      `📦 *Amount due after unload:* ₹${formattedAmount}\n\n` +
      `Please ensure terrace access is available so our team can unload safely.\n\n` +
      `Thank you,\n*Typhoon Solar Team*`;

    return `https://wa.me/${this.sanitizePhone(params.customerPhone)}?text=${encodeURIComponent(text)}`;
  }

  // 3. Payment Reminder (Screens 8, 36, 37)
  static buildPaymentReminderMessage(params: {
    customerPhone: string;
    customerName: string;
    milestoneTitle: string;
    amountDue: number;
  }): string {
    const formattedAmount = new Intl.NumberFormat('en-IN').format(params.amountDue);
    const text =
      `Dear ${params.customerName} ji,\n\n` +
      `This is a gentle payment reminder from Typhoon Solar:\n\n` +
      `📌 *Milestone:* ${params.milestoneTitle}\n` +
      `💰 *Pending Amount:* ₹${formattedAmount}\n\n` +
      `Kindly arrange the transfer so we can proceed with the next installation phase without delay.\n\n` +
      `Thank you,\n*Typhoon Solar Accounts Team*`;

    return `https://wa.me/${this.sanitizePhone(params.customerPhone)}?text=${encodeURIComponent(text)}`;
  }

  // 4. Net-Meter Live / System Commissioned (Screen 20)
  static buildSystemStartMessage(params: {
    customerPhone: string;
    customerName: string;
    systemKw: number;
  }): string {
    const text =
      `Congratulations ${params.customerName} ji! 🎉☀️\n\n` +
      `Your *${params.systemKw} kW* solar rooftop plant is now officially connected with the GEB bi-directional net meter and generating green electricity!\n\n` +
      `Our team has initiated your *PM Surya Ghar* subsidy claim on the National Portal.\n\n` +
      `Welcome to zero electricity bills!\n*Typhoon Solar Solutions*`;

    return `https://wa.me/${this.sanitizePhone(params.customerPhone)}?text=${encodeURIComponent(text)}`;
  }

  // 5. Customer Feedback Request (Screen 26, 44)
  static buildFeedbackRequestMessage(params: {
    customerPhone: string;
    customerName: string;
    feedbackUrl: string;
  }): string {
    const text =
      `Dear ${params.customerName} ji,\n\n` +
      `Thank you for choosing Typhoon Solar! ☀️\n\n` +
      `Your project is now 100% completed. Could you please take 30 seconds to share your experience with us?\n\n` +
      `⭐ Rate our service here:\n${params.feedbackUrl}\n\n` +
      `Your feedback helps us serve you better.\n*Typhoon Solar Solutions*`;

    return `https://wa.me/${this.sanitizePhone(params.customerPhone)}?text=${encodeURIComponent(text)}`;
  }
}

