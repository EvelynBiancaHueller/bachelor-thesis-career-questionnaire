export type Question = {
    id: number;
    text: string;
    scale: string;
    story_id: number;
    imagery: string;
}

export type AnswerOption = {
    id: number;
    value: number;
    text: string;
}

export type Answer = {
    user_id: number;
    question_id: number;
    answer_option_id: number;
}