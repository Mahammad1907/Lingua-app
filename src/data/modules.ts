import { Module } from './types';

// ═══════════════════════════════════════
// MODULLAR
// ═══════════════════════════════════════
export const modules: Module[] = [
  {
    id: 'module_1',
    title: 'First conversations',
    titleAz: 'İlk tanışlıq',
    description: '8 dərs: salamlaşma, ad, hal-əhval, təşəkkür, üzr, başa düşmədim və bölmə söhbəti',
    language: 'en',
    level: 'A1',
    order: 1,
    phase: 1,
    icon: '👋',
    lessonIds: [
      'a1_en_b1_v2_d1', 'a1_en_b1_v2_d2', 'a1_en_b1_v2_d3', 'a1_en_b1_v2_d4',
      'a1_en_b1_v2_d5', 'a1_en_b1_v2_d6', 'a1_en_b1_v2_d7', 'a1_en_b1_v2_d8',
    ],
    finalReviewId: 'a1_en_b1_v2_d8',
    hasSpeakingPractice: false,
    speakingTitle: 'Speaking Practice',
    speakingDescription:
      'Öyrəndiyin salamlaşma ifadələrini botla danışıqda istifadə et',
  },
  {
    // docs/BOLME_2_XERITESI.md — 8 map lessons; lessons 1, 3 and 7 have two parts (11 lesson ids).
    id: 'module_2',
    title: 'Personal details',
    titleAz: 'Şəxsi məlumat',
    description: '8 dərs: rəqəmlər, telefon, hərflər, hərf-hərf demək, ad və soyad, e-poçt, yaş və qeydiyyat söhbəti',
    language: 'en',
    level: 'A1',
    order: 2,
    phase: 1,
    icon: '🪪',
    lessonIds: [
      'a1_en_b2_d1a', 'a1_en_b2_d1b', 'a1_en_b2_d2', 'a1_en_b2_d3a', 'a1_en_b2_d3b', 'a1_en_b2_d3c', 'a1_en_b2_d4',
      'a1_en_b2_d5', 'a1_en_b2_d6', 'a1_en_b2_d7a', 'a1_en_b2_d7b', 'a1_en_b2_d8',
    ],
    finalReviewId: 'a1_en_b2_d8',
    hasSpeakingPractice: false,
  },
  {
    // docs/BOLME_3_XERITESI.md — 8 map lessons; lessons 2, 3 and 5 have two parts (11 lesson ids).
    id: 'module_3',
    title: 'Where are you from?',
    titleAz: 'Haradansan',
    description: '8 dərs: haradan olduğun, ölkələr, millət, bəli/xeyr sualı, o (he/she), harada yaşadığın, dillər və dil klubu söhbəti',
    language: 'en',
    level: 'A1',
    order: 3,
    phase: 1,
    icon: '🌍',
    lessonIds: [
      'a1_en_b3_d1', 'a1_en_b3_d2a', 'a1_en_b3_d2b', 'a1_en_b3_d3a', 'a1_en_b3_d3b', 'a1_en_b3_d4',
      'a1_en_b3_d5a', 'a1_en_b3_d5b', 'a1_en_b3_d6', 'a1_en_b3_d7', 'a1_en_b3_d8',
    ],
    finalReviewId: 'a1_en_b3_d8',
    hasSpeakingPractice: false,
  },
  {
    // docs/BOLME_4_XERITESI.md — 8 map lessons; lesson 2 has two parts (9 lesson ids).
    id: 'module_4',
    title: 'Family and people',
    titleAz: 'Ailə və insanlar',
    description: '8 dərs: bu kimdir, ailə üzvləri, his/her, bu sənindir?, I have, yaş, peşə və dostunla ailə söhbəti',
    language: 'en',
    level: 'A1',
    order: 4,
    phase: 1,
    icon: '👨‍👩‍👧',
    lessonIds: [
      'a1_en_b4_d1', 'a1_en_b4_d2a', 'a1_en_b4_d2b', 'a1_en_b4_d3', 'a1_en_b4_d4',
      'a1_en_b4_d5', 'a1_en_b4_d6', 'a1_en_b4_d7', 'a1_en_b4_d8',
    ],
    finalReviewId: 'a1_en_b4_d8',
    hasSpeakingPractice: false,
  },
];

// ═══════════════════════════════════════
// KÖMƏKÇI FUNKSİYALAR
// ═══════════════════════════════════════

export const getModuleById = (id: string): Module | undefined => {
  return modules.find((m) => m.id === id);
};

export const getAllModules = (): Module[] => {
  return [...modules].sort((a, b) => a.order - b.order);
};

export const getModulesByLanguage = (language: string): Module[] => {
  return modules
    .filter((m) => m.language === language)
    .sort((a, b) => a.order - b.order);
};

export const getModulesByLevel = (level: string): Module[] => {
  return modules
    .filter((m) => m.level === level)
    .sort((a, b) => a.order - b.order);
};
