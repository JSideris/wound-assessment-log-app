export interface SubstanceAbuse {
  alcohol: boolean;
  tobacco: boolean;
  drugs: boolean;
  inhalants: boolean;
  other: string;
}

export interface Interventions {
  cleansing: string;
  debridement: string;
  dressing: string;
  adjunctive: string;
  other: string;
}

export interface PatientEducation {
  woundCare: boolean;
  nutrition: boolean;
  smoking: boolean;
  offloading: boolean;
  other: string;
}

export interface SignsOfInfection {
  increasedPain: boolean;
  erythema: boolean;
  edema: boolean;
  warmth: boolean;
  fever: boolean;
  purulent: boolean;
  delayed: boolean;
  friable: boolean;
  foul: boolean;
  other: string;
}

export interface FollowUp {
  continue: boolean;
  modify: boolean;
  modifyText: string;
  consult: boolean;
  consultText: string;
  labs: boolean;
  labsText: string;
  other: string;
}

export interface WoundType {
  chronic: boolean;
  abrasion: boolean;
  acute: boolean;
  arterial: boolean;
  infected: boolean;
  burn: boolean;
  diabetic: boolean;
  laceration: boolean;
  surgical: boolean;
  pressure: boolean;
  puncture: boolean;
  venous: boolean;
  traumatic: boolean;
  other: string;
}

export interface WoundDimensions {
  length: number | '';
  width: number | '';
  depth: number | '';
}

export interface WoundAppearance {
  epithelial: number | '';
  granulation: number | '';
  slough: number | '';
  necrotic: number | '';
  pink: boolean;
  red: boolean;
  yellow: boolean;
  black: boolean;
  other: string;
}

export interface PeriwoundSkin {
  intact: boolean;
  erythema: boolean;
  macerated: boolean;
  indurated: boolean;
  excoriated: boolean;
  dry: boolean;
  callused: boolean;
  hyperPigmented: boolean;
}

export interface TunnelingUndermining {
  location: string;
  depth: number | '';
}

export interface WoundAssessment {
  id?: string;
  encounterId?: string;
  isFollowup?: boolean;
  lastModified?: number;
  bedRoom: string;
  patientName: string;
  idMrn: string;
  age: string;
  sex: string;
  address: string;
  contactInfo: string;
  date: string;
  selectedDay: number | null;
  time: string;
  timeAmPm: 'am' | 'pm';
  medicalHistory: string;
  substanceAbuse: SubstanceAbuse;
  interventions: Interventions;
  patientEducation: PatientEducation;
  signsOfInfection: SignsOfInfection;
  photographed: boolean;
  photographedDate: string;
  followUp: FollowUp;
  nextAssessment: string;
  dateOfInjury: string;
  woundType: WoundType;
  woundLocation: string;
  dimensions: WoundDimensions;
  appearance: WoundAppearance;
  edges: {
    wellDefined: boolean;
    irregular: boolean;
    rolled: boolean;
  };
  exudate: 'None' | 'Light' | 'Mod' | 'Heavy';
  odor: 'None' | 'Mild' | 'Mod' | 'Strong';
  odorCharacteristics: string;
  painLevel: number | '';
  periwoundSkin: PeriwoundSkin;
  tunneling: TunnelingUndermining;
  undermining: TunnelingUndermining;
  notes: string;
}

export const FORM_VERSION = '1.0.0';
