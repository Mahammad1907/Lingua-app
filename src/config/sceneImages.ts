/**
 * Lesson scene pictures, keyed by the scene ids used in lesson data (`scenes: [...]`).
 * The full list of planned pictures is in docs/SEKIL_SIYAHISI.md.
 * When a picture is ready: put the file at the path given in that list and add one line here, e.g.
 *   'd1/meet-street': require('../../assets/lessons/d1/meet-street.webp'),
 */
export const SCENE_IMAGES: Record<string, number> = {};

/**
 * Temporary markers: while true, every place that waits for a picture shows a dashed frame with the
 * picture's number from docs/SEKIL_SIYAHISI.md. Set to false before release.
 */
export const SHOW_IMAGE_SLOTS = true;

/** Number and short description of each planned picture (docs/SEKIL_SIYAHISI.md). */
export const SCENE_NOTES: Record<string, string> = {
  'd1/word-hello': '1.11 · Biri tanışını görüb salam verir',
  'd1/meet-street': '1.2 · Küçədə tanışlar rastlaşır',
  'd1/word-goodbye': '1.12 · Biri gedərkən dönüb əl yelləyir',
  'd1/cafe-door-scene': '1.13 · Kafe qapısı: biri girir, biri oturub, biri çıxır',
  'd1/mascot-leaving': '1.4 · Maskot qapıdan çıxır, boş nitq balonu',
  'd1/visit-start': '1.5 · Görüşün əvvəli: qız qapını açır',
  'd1/visit-end': '1.6 · Görüşün sonu: oğlan əl yelləyib çıxır',
  'd1/meet-yard': '1.7 · Həyətdə səhər rastlaşma',
  'd1/mascot-party-leaving': '1.8 · Maskot qonaqlıqdan çıxır',
  'd1/video-start': '1.9 · Video zəngin əvvəli',
  'd1/video-end': '1.10 · Video zəngin sonu',
  'd6/cafe-spill': '5.1 · Kafe: qəhvəni tökən oğlan',
  'd6/bus-stop': '5.2 · Dayanacaq: yol soruşan qız',
  'd8/party': '5.3 · Ziyafət: qapıdan çıxan oğlan',
  'd8/party-door': '5.4 · Ziyafətin girişi: yeni gələn qız',
  'd2/new-friend': '6.1 · Yeni tanışlar: qız özünü oğlana təqdim edir',
  'd2/new-classmates': '6.2 · Sinifdə yeni yoldaşlar tanış olur',
  'd2/registration': '6.3 · Qeydiyyat masası: işçi soruşur, oğlan cavab verir',
  'd2/game-profile': '6.4 · Telefonda oyun profili yaradılır',
  'd6/thank-girl': '6.5 · Oğlan qıza təşəkkür edir, qız gülümsəyir',
  'd6/directions': '6.6 · Oğlan küçədə yol göstərir',
  'd6/street-ask': '6.7 · Küçədə qız yoldan keçənə yaxınlaşır',
  'd6/foot-step': '6.8 · Avtobusda biri təsadüfən başqasının ayağına basır',
  'd8/party-meet': '6.9 · Ziyafətdə iki nəfər tanış olur',
  'd8/online-class': '6.10 · Onlayn dərs: ekranda yoldaşlar',
};

export function sceneImage(ids?: string[]): number | undefined {
  for (const id of ids ?? []) if (SCENE_IMAGES[id] !== undefined) return SCENE_IMAGES[id];
  return undefined;
}

/** The pictures that are still missing, for the temporary markers. */
export function missingScenes(ids?: string[]): string[] {
  if (!SHOW_IMAGE_SLOTS || !ids?.length || sceneImage(ids) !== undefined) return [];
  return ids.map(id => SCENE_NOTES[id] ?? id);
}
