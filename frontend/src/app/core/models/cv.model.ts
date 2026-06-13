export type Lang = 'tr' | 'en';

/** A string that exists in both supported languages. */
export interface Localized {
  tr: string;
  en: string;
}

/** Same as Localized but the value may be intentionally empty (optional fields). */
export interface LocalizedNullable {
  tr: string | null;
  en: string | null;
}

export interface Contact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: Localized;
}

export interface Profile {
  name: string;
  /** Path to an optimized (WebP) headshot, served from /assets. */
  photo: string;
  /** Short initials fallback shown when no photo is present. */
  initials: string;
  title: Localized;
  summary: Localized;
  contact: Contact;
}

export interface HrSignals {
  location: Localized;
  workPreference: Localized;
  availability: Localized;
  noticePeriod: Localized;
  workAuthorization: Localized;
  /** Optional. When tr/en are null the chip is hidden. */
  salaryExpectation: LocalizedNullable;
  openToWork: boolean;
  yearsOfExperience: string;
}

export interface ExperienceItem {
  company: string;
  role: Localized;
  period: Localized;
  /** ISO-ish sortable key, newest first. */
  start: string;
  current: boolean;
  location: Localized;
  /** All highlights are always visible (HR-friendly rule). */
  highlights: Localized[];
  tech: string[];
  /** Optional longer narrative shown behind a "read more" toggle. */
  detail?: Localized;
}

export interface CaseMetric {
  label: Localized;
  value: string;
}

export interface CaseStudy {
  id: string;
  title: Localized;
  company: string;
  period: string;
  problem: Localized;
  solution: Localized;
  impact: Localized;
  tech: string[];
  metrics: CaseMetric[];
}

export interface SkillItem {
  name: string;
}

export interface SkillGroup {
  category: Localized;
  /** Lucide-style icon name used by the UI. */
  icon: string;
  items: SkillItem[];
}

export interface EducationItem {
  degree: Localized;
  field: Localized;
  school: Localized;
  period: Localized;
}

export interface LanguageItem {
  name: Localized;
  level: Localized;
}

export interface Testimonial {
  name: string;
  role: Localized;
  company: string;
  quote: Localized;
}

export interface CvData {
  profile: Profile;
  hrSignals: HrSignals;
  experience: ExperienceItem[];
  caseStudies: CaseStudy[];
  skills: SkillGroup[];
  education: EducationItem[];
  certificates: Localized[];
  languages: LanguageItem[];
  testimonials: Testimonial[];
}
