export const STAGE_IDS = [1, 2, 3, 4, 5] as const;
export type StageId = (typeof STAGE_IDS)[number];
export const LOCKED_ICON = "/icons/stages/question-mark.svg";
