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
