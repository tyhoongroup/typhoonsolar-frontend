// ----------------------------------------------------
// TYPHOON SOLAR ENUMS & DOMAIN TYPES
// ----------------------------------------------------

export enum UserRole {
  ADMIN = 'ADMIN',
  OPS_MANAGER = 'OPS_MANAGER',
  SALESPERSON = 'SALESPERSON',
  MATERIAL_MANAGER = 'MATERIAL_MANAGER', // Sohail bhai
  INSTALLATION_TEAM = 'INSTALLATION_TEAM',
  PORTAL_USER = 'PORTAL_USER',           // Rahul bhai
  ACCOUNTANT = 'ACCOUNTANT',             // Meera
  SERVICE_TECH = 'SERVICE_TECH'
}

export enum ProjectStage {
  INQUIRY_RECEIVED = 'INQUIRY_RECEIVED',             // Stage 1
  SITE_VISIT_PLANNED = 'SITE_VISIT_PLANNED',         // Stage 2
  QUOTATION_SENT = 'QUOTATION_SENT',                 // Stage 3
  DEAL_CLOSED = 'DEAL_CLOSED',                       // Stage 4
  GOVT_DOCS_SUBMITTED = 'GOVT_DOCS_SUBMITTED',       // Stage 5
  SR_NUMBER_ISSUED = 'SR_NUMBER_ISSUED',             // Stage 6
  MATERIAL_PLANNED = 'MATERIAL_PLANNED',             // Stage 7
  MATERIAL_UNLOADED = 'MATERIAL_UNLOADED',           // Stage 8
  INSTALLATION_DONE = 'INSTALLATION_DONE',           // Stage 9
  METER_FILE_SUBMITTED = 'METER_FILE_SUBMITTED',     // Stage 10
  METER_STARTED = 'METER_STARTED',                   // Stage 11
  SUBSIDY_CLAIMED = 'SUBSIDY_CLAIMED',               // Stage 12
  SUBSIDY_RECEIVED = 'SUBSIDY_RECEIVED',             // Stage 13
  COMPLETED = 'COMPLETED'                            // Stage 14
}

export enum FollowupStatus {
  ON_TRACK = 'ON_TRACK',
  DELAYED = 'DELAYED',
  DONE = 'DONE',
  CALL_DONE = 'CALL_DONE',
  NOT_REACHABLE = 'NOT_REACHABLE'
}

export enum PaymentMilestoneType {
  BOOKING_ADVANCE = 'BOOKING_ADVANCE',
  MATERIAL_UNLOAD = 'MATERIAL_UNLOAD',
  INSTALLATION_METER = 'INSTALLATION_METER',
  SUBSIDY_SETTLEMENT = 'SUBSIDY_SETTLEMENT'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  DUE = 'DUE',
  PAID = 'PAID'
}

export enum TicketStatus {
  LOGGED = 'LOGGED',
  VISIT_SCHEDULED = 'VISIT_SCHEDULED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export type MeterPhase = 'Single Phase' | 'Three Phase';
export type PanelTech = 'Polycrystalline' | 'Monocrystalline' | 'Bi-facial' | 'Topcon';

