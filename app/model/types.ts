import { ReactNode } from "react";

export type SingleStageAnswer = Record<number, number>;

export type AnswersByStage = Record<number, SingleStageAnswer>;

export type PostAnswers = Partial<Record<number, LikertValue>>;

export type OpenQuestion = {
    id: number;
    text: string;
};

export type OpenAnswers = Record<number, string>;

export type LikertValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Step = {
    id: string;
    title?: string;
    body: ReactNode;
};

export type ProfileData = {
    gender: string;
    age: string;
    education: string;
    question_career_test: string;
    question_career_chosen: string;
};

export type QuestionnaireVersion = "gamified" | "non-gamified";
