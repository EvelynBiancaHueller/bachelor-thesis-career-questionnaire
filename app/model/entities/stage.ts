import { Question } from "./question";

export type Story = {
    id: number;
    title: string;
    description: string;
    source: string;
};

export type StageData = {
    story: Story;
    questions: Question[];
}
