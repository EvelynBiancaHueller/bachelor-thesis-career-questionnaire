export type PostQuestion = {
    id: number;
    text: string;
    scale: string;
    reverse: boolean;
}

export type PostAnswer = {
    user_id: number;
    post_question_id: number;
    answer_value: number;
}
