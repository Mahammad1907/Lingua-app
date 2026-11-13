/**
 * Lesson scene pictures, keyed by the scene ids used in lesson data (`scenes: [...]`).
 * The full list of planned pictures is in docs/SEKIL_SIYAHISI.md.
 * When a picture is ready: put the file at the path given in that list and add one line here, e.g.
 *   'd1/meet-street': require('../../assets/lessons/d1/meet-street.webp'),
 * A task whose scene has no file yet simply shows no picture.
 */
export const SCENE_IMAGES: Record<string, number> = {};

export function sceneImage(ids?: string[]): number | undefined {
  for (const id of ids ?? []) if (SCENE_IMAGES[id] !== undefined) return SCENE_IMAGES[id];
  return undefined;
}
