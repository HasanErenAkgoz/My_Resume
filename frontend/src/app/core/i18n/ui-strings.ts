import { Lang } from '../models/cv.model';

/** UI chrome labels (buttons, section titles) kept separate from CV content. */
export const UI = {
  scanMode: { tr: 'Tarama Modu', en: 'Scan Mode' },
  exploreMode: { tr: 'Keşif Modu', en: 'Explore Mode' },
  downloadCv: { tr: 'CV İndir', en: 'Download CV' },
  openToWork: { tr: 'İşe Açık', en: 'Open to work' },
  experienceYears: { tr: 'yıl deneyim', en: 'yrs experience' },
  lastRole: { tr: 'Son pozisyon', en: 'Current role' },
  availability: { tr: 'Müsaitlik', en: 'Availability' },
  workPreference: { tr: 'Çalışma tercihi', en: 'Work preference' },
  coreStack: { tr: 'Temel Teknolojiler', en: 'Core Stack' },
  noticePeriod: { tr: 'İhbar süresi', en: 'Notice period' },

  navSummary: { tr: 'Özet', en: 'Summary' },
  navHello: { tr: 'Özet', en: 'Summary' },
  navAbout: { tr: 'Deneyim', en: 'Experience' },
  navProjects: { tr: 'Projeler', en: 'Projects' },
  navSkillsNav: { tr: 'Yetkinlikler', en: 'Skills' },
  navContactNav: { tr: 'İletişim', en: 'Contact' },
  navCases: { tr: 'Öne Çıkan Projeler', en: 'Featured Projects' },
  navExperience: { tr: 'Deneyim', en: 'Experience' },
  navSkills: { tr: 'Yetkinlikler', en: 'Skills' },
  navEducation: { tr: 'Eğitim', en: 'Education' },
  navContact: { tr: 'İletişim', en: 'Contact' },

  sectionCases: { tr: 'Öne Çıkan Projeler', en: 'Featured Projects' },
  sectionCasesSub: { tr: 'Ne yaptım, neden ve sonucu', en: 'What I built, why, and the outcome' },
  sectionExperience: { tr: 'Kariyer Yolculuğu', en: 'Career Journey' },
  sectionSkills: { tr: 'Teknik Yetkinlikler', en: 'Technical Skills' },
  sectionGithub: { tr: 'GitHub Aktivitesi', en: 'GitHub Activity' },
  sectionEducation: { tr: 'Eğitim', en: 'Education' },
  sectionLanguages: { tr: 'Diller', en: 'Languages' },
  sectionContact: { tr: 'İletişime Geçin', en: 'Get in Touch' },
  sectionContactSub: {
    tr: 'Yeni fırsatlar ve iş birlikleri için açığım.',
    en: 'Open to new opportunities and collaborations.',
  },

  problem: { tr: 'Problem', en: 'Problem' },
  solution: { tr: 'Çözüm', en: 'Solution' },
  impact: { tr: 'Etki', en: 'Impact' },
  readMore: { tr: 'Daha fazla', en: 'Read more' },
  readLess: { tr: 'Daha az', en: 'Show less' },

  problemLabel: { tr: 'Problem', en: 'Problem' },
  emailMe: { tr: 'E-posta gönder', en: 'Email me' },
  viewLinkedin: { tr: 'LinkedIn', en: 'LinkedIn' },
  viewGithub: { tr: 'GitHub', en: 'GitHub' },
  callMe: { tr: 'Telefon', en: 'Phone' },

  heroHeadlineLead: {
    tr: '.NET · Angular · OpenAI ile',
    en: 'With .NET · Angular · OpenAI —',
  },
  heroHeadlineAccent: { tr: 'kurumsal ve AI projeler geliştiriyorum.', en: 'I build enterprise and AI products.' },
  heroCodeLine: { tr: "> stack = ['.NET', 'Angular', 'OpenAI'];", en: "> stack = ['.NET', 'Angular', 'OpenAI'];" },
  viewProjects: { tr: 'Projeleri Gör', en: 'View Projects' },
  statYears: { tr: 'Yıl Deneyim', en: 'Years Experience' },
  statProjects: { tr: 'Öne Çıkan Proje', en: 'Featured Projects' },
  statTech: { tr: 'Teknoloji', en: 'Technologies' },
  statPassion: { tr: 'Tutku', en: 'Passion' },
  statPassionValue: { tr: 'İşe açık', en: 'Open to work' },

  reposPublic: { tr: 'Public repo', en: 'Public repos' },
  followers: { tr: 'Takipçi', en: 'Followers' },
  recentActivity: { tr: 'Son aktivite', en: 'Recent activity' },
  viewOnGithub: { tr: "GitHub'da gör", en: 'View on GitHub' },

  cookieText: {
    tr: 'Bu site, ziyaret istatistiklerini ölçmek için çerez kullanır. Onayınız olmadan hiçbir analitik veri toplanmaz.',
    en: 'This site uses cookies to measure visit statistics. No analytics data is collected without your consent.',
  },
  cookieAccept: { tr: 'Kabul Et', en: 'Accept' },
  cookieReject: { tr: 'Reddet', en: 'Reject' },
  privacyLink: { tr: 'Gizlilik Politikası', en: 'Privacy Policy' },

  backHome: { tr: 'Ana sayfaya dön', en: 'Back to home' },
  footerNote: {
    tr: 'Angular ile sıfırdan tasarlandı ve geliştirildi.',
    en: 'Designed and built from scratch with Angular.',
  },
} satisfies Record<string, Record<Lang, string>>;

export type UiKey = keyof typeof UI;
