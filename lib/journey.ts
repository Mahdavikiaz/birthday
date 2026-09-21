/**
 * The journey is a linear, controlled sequence. One stage is mounted at a time.
 *
 * Ten stages are grouped into five "acts" so the progress indicator stays
 * readable on a 375px screen: two-part acts (chapter one + two, chapter three +
 * cake, one-more-thing + gift) read as a single beat to the visitor.
 */

export const STAGES = [
  'landing',
  'chapter1',
  'chapter2',
  'chapter3',
  'cake',
  'wishes',
  'oneMoreThing',
  'gift',
  'tracking',
  'complete',
] as const;

export type StageId = (typeof STAGES)[number];

/** Zero-based act index for each stage. `null` = outside the counted journey. */
const STAGE_ACT: Record<StageId, number | null> = {
  landing: null,
  chapter1: 0,
  chapter2: 0,
  chapter3: 1,
  cake: 1,
  wishes: 2,
  oneMoreThing: 3,
  gift: 3,
  tracking: 4,
  complete: null,
};

export const ACT_COUNT = 5;

export function actIndexOf(stage: StageId): number | null {
  return STAGE_ACT[stage];
}

export function nextStage(stage: StageId): StageId {
  const index = STAGES.indexOf(stage);
  return STAGES[Math.min(index + 1, STAGES.length - 1)];
}

export function previousStage(stage: StageId): StageId {
  const index = STAGES.indexOf(stage);
  return STAGES[Math.max(index - 1, 0)];
}

/** Two digits, so "3" never appears next to "06". */
export function padAct(index: number): string {
  return String(index + 1).padStart(2, '0');
}
