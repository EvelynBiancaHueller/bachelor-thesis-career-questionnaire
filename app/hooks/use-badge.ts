"use client";

import { Badge } from "@/model/entities/badge";
import { AnswerOption } from "@/model/entities/question";
import { AnswersByStage } from "@/model/types";
import { useMemo, useState } from "react";

type UseBadgeOptions = {
    badges: Record<number, Badge>;
    answerOptions: AnswerOption[];
    questionsToUnlockBadges: Record<number, number[]>;
    answersByStage: AnswersByStage;
    completedStages: Set<number>;
};

export function useBadge({
    badges,
    answerOptions,
    questionsToUnlockBadges,
    answersByStage,
    completedStages
}: UseBadgeOptions) {
    const [open, setOpen] = useState(false);
    
    function openBadge() {
        setOpen(true);
    }

    function closeBadge() {
        setOpen(false);
    }

    const collectedBadgeIds = useMemo(() => {
        const answerOptionValueById = Object.fromEntries(answerOptions.map((option) => [option.id, option.value]));
        const answersByQuestion = Object.values(answersByStage).reduce<Record<number, number>>(
            (acc, stageAnswers) => {
                Object.entries(stageAnswers).forEach(([questionId, answerOptionId]) => {
                    acc[Number(questionId)] = answerOptionId;
                });
                return acc;
            },
            {}
        );

        const interestBadgeIds = Object.values(badges).reduce<number[]>((acc, badge) => {
            const questionIds = questionsToUnlockBadges[badge.id] ?? [];

            if (questionIds.length === 0) return acc;

            const positiveCount = questionIds.reduce((count, questionId) => {
                const answerOptionId = answersByQuestion[questionId];
                if (answerOptionId === undefined) return count;

                const answerValue = answerOptionValueById[answerOptionId];
                const isPositive = answerValue === 3 || answerValue === 4;

                return isPositive ? count + 1 : count;
            }, 0);

            if (positiveCount >= Number(badge.threshold)) acc.push(badge.id);

            return acc;
        }, []);

        const progressBadgeIds: number[] = [];
        
        if (completedStages.has(0)) {
            progressBadgeIds.push(19);
        }
        if (completedStages.has(3)) {
            progressBadgeIds.push(20);
        }
        if (completedStages.has(5)) {
            progressBadgeIds.push(21);
        }

        return [...interestBadgeIds, ...progressBadgeIds];
    }, [answersByStage, badges, answerOptions, questionsToUnlockBadges, completedStages]);

    return {
        open,
        collectedBadgeIds,
        openBadge,
        closeBadge,
    };
}
