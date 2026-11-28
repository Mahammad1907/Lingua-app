// Müəllim izahı cards and Qaydalar names of Bölmə 4 (each lesson file exports `explains` and `ruleMeta`).
import type { ExplainCard } from '../designLessonTypes';
import { explains as e_lesson1, ruleMeta as r_lesson1 } from './lesson1';
import { explains as e_lesson2a, ruleMeta as r_lesson2a } from './lesson2a';
import { explains as e_lesson2b, ruleMeta as r_lesson2b } from './lesson2b';
import { explains as e_lesson3, explains2 as e_lesson3_2, ruleMeta as r_lesson3 } from './lesson3';
import { explains as e_lesson4, explains2 as e_lesson4_2, ruleMeta as r_lesson4 } from './lesson4';
import { explains as e_lesson5, explains2 as e_lesson5_2, ruleMeta as r_lesson5 } from './lesson5';
import { explains as e_lesson6, explains2 as e_lesson6_2, ruleMeta as r_lesson6 } from './lesson6';
import { explains as e_lesson7, explains2 as e_lesson7_2, ruleMeta as r_lesson7 } from './lesson7';
import { explains as e_lesson8, ruleMeta as r_lesson8 } from './lesson8';

export const unit4Explains: Record<string, { after: string; card: ExplainCard }[]> = {
  a1_en_b4_d1: e_lesson1,
  a1_en_b4_d2a: e_lesson2a,
  a1_en_b4_d2b: e_lesson2b,
  a1_en_b4_d3: e_lesson3,
  a1_en_b4_d3_2: e_lesson3_2,
  a1_en_b4_d4: e_lesson4,
  a1_en_b4_d4_2: e_lesson4_2,
  a1_en_b4_d5: e_lesson5,
  a1_en_b4_d5_2: e_lesson5_2,
  a1_en_b4_d6: e_lesson6,
  a1_en_b4_d6_2: e_lesson6_2,
  a1_en_b4_d7: e_lesson7,
  a1_en_b4_d7_2: e_lesson7_2,
  a1_en_b4_d8: e_lesson8,
};
export const unit4RuleMeta = { ...r_lesson1, ...r_lesson2a, ...r_lesson2b, ...r_lesson3, ...r_lesson4, ...r_lesson5, ...r_lesson6, ...r_lesson7, ...r_lesson8 };
