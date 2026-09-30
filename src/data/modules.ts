import { Module } from './types';

// ═══════════════════════════════════════
// MODULLAR
// Hər modul bir learning path-dir.
// Yeni modul əlavə etmək üçün sadəcə
// aşağıdaki massivə yeni obyekt əlavə edin.
// ═══════════════════════════════════════
export const modules: Module[] = [
  {
    id: 'module_1',
    title: 'Greetings',
    titleAz: 'Salamlaşma',
    description: 'İlk sözlər, salamlaşma və sağollaşma formaları',
    language: 'en',
    level: 'A1',
    order: 1,
    icon: '👋',
    lessonIds: ['a1_en_01', 'a1_en_02', 'a1_en_03'],
    hasSpeakingPractice: true,
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