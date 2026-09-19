export type Badge = {
    id: number;
    description: string;
    threshold: number;
    source: string;
}

export type QuestionsToUnlockBadge = {
    badge_id: number;
    question_id: number;
}