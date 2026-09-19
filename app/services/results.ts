import { AnswersByStage } from "@/model/types";

type RiasecSums = Record<RiasecKey, number>;

export type RiasecKey = "R" | "I" | "A" | "S" | "E" | "C";

type RiasecLabels = "Realistic" | "Investigative" | "Artistic" | "Social" | "Enterprising" | "Conventional";

export type RiasecChartItem = {
    key: RiasecKey;
    label: string;
    score: number;
    color: string;
};

const RIASEC_LABELS: Record<keyof RiasecSums, RiasecLabels> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

export function buildRiasecChartData(results: RiasecSums): RiasecChartItem[] {
    return [
        { key: "R", label: "Realistic", score: results.R, color: "#D08173" },
        { key: "I", label: "Investigative", score: results.I, color: "#6D6DA9" },
        { key: "A", label: "Artistic", score: results.A, color: "#91C79E" },
        { key: "S", label: "Social", score: results.S, color: "#78C5DE" },
        { key: "E", label: "Enterprising", score: results.E, color: "#A16995" },
        { key: "C", label: "Conventional", score: results.C, color: "#F6CC70" },
    ] as const;
}

export function getTopThreeResults(results: RiasecSums): RiasecLabels[] {
    return (Object.entries(results) as [keyof RiasecSums, number][])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => RIASEC_LABELS[key]);
}

export function calculateResults(answersByStage: AnswersByStage) {
    const results: RiasecSums = {
        R: 0,
        I: 0,
        A: 0,
        S: 0,
        E: 0,
        C: 0,
    };

    Object.values(answersByStage).forEach((stageAnswers) => {
        const sortedQuestionEntries = Object.entries(stageAnswers)
            .map(([questionNumber, answerValue]) => [Number(questionNumber), answerValue] as const)
            .sort((a, b) => a[0] - b[0]);
        
        sortedQuestionEntries.forEach(([, answerValue], index) => {
            if (index < 2) results.R += answerValue;
            else if (index < 4) results.I += answerValue;
            else if (index < 6) results.A += answerValue;
            else if (index < 8) results.S += answerValue;
            else if (index < 10) results.E += answerValue;
            else if (index < 12) results.C += answerValue;
        });
    });

    return results;
}

export function calculateResultsForNonGamifiedVersion(answers: Record<number, number>) {
    const results: RiasecSums = {
        R: 0,
        I: 0,
        A: 0,
        S: 0,
        E: 0,
        C: 0,
    };

    const sortedQuestionEntries = Object.entries(answers)
        .map(([questionNumber, answerValue]) => [Number(questionNumber), answerValue] as const)
        .sort((a, b) => a[0] - b[0]);
    
    sortedQuestionEntries.forEach(([, answerValue], index) => {
        const i = index % 12;

        if (index < 2) results.R += answerValue;
        else if (i < 4) results.I += answerValue;
        else if (i < 6) results.A += answerValue;
        else if (i < 8) results.S += answerValue;
        else if (i < 10) results.E += answerValue;
        else if (i < 12) results.C += answerValue;
    });

    return results;
}

export function getRiasecColor(label: string | undefined, data: RiasecChartItem[]) {
    return data.find((entry) => entry.label === label)?.color;
}
