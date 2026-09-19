"use client";

import { STAGE_IDS, StageId } from "@/components/gamified-version/stage/constants";
import { Answer } from "@/model/entities/question";
import { StageData } from "@/model/entities/stage";
import { AnswersByStage } from "@/model/types";
import { getStageAnswers } from "@/services/data-restoration";
import { useEffect, useMemo, useState } from "react";

type UseStageOptions = {
    stageDataMap: Record<number, StageData>;
    dataLoading: boolean;
    userId: number | null;
    onPersistStageAnswers: (answers: Answer[]) => Promise<void>;
    onError?: (message: string) => void;
};

export function useStage({
    stageDataMap,
    dataLoading,
    userId,
    onPersistStageAnswers,
    onError,
}: UseStageOptions) {
    const [open, setOpen] = useState(false);
    const [activeStage, setActiveStage] = useState<StageId | null>(null);
    const [readOnly, setReadOnly] = useState(false);

    const [unlockedStages, setUnlockedStages] = useState<Set<number>>(new Set());
    const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
    const [answersByStage, setAnswersByStage] = useState<AnswersByStage>({}); // stage, question, value

    const activeStageData = useMemo(() => {
        if (!activeStage) return null;
        return stageDataMap[activeStage] ?? null;
    }, [activeStage, stageDataMap]);

    const story = activeStageData?.story ?? null;
    const questions = activeStageData?.questions ?? [];

    useEffect(() => {
        if (!userId || dataLoading) return;

        let cancelled = false;

        async function hydrateStageAnswers() {
            try {
                const restoredAnswers: AnswersByStage = await getStageAnswers(Number(userId));

                if (cancelled) return;

                setAnswersByStage(restoredAnswers);

                const {unlocked, completed} = deriveStageProgress(restoredAnswers);

                setUnlockedStages(unlocked);

                setCompletedStages((prev) => {
                    const next = new Set(prev);

                    completed.forEach((stageId) => {
                        next.add(stageId);
                    });
                    
                    return next;
                })
            } catch (error) {
                console.error("Failed to restore stage answers", error);
                onError?.("We couldn't restore your progress right now.");
            }
        }

        void hydrateStageAnswers();

        return () => {
            cancelled = true;
        }
    }, [userId, dataLoading]);

    function unlockStage(stageId: StageId) {
        setUnlockedStages((prev) => {
            if (prev.has(stageId)) return prev;
            
            const next = new Set(prev);
            next.add(stageId);
            return next;
        });
    }

    function addCompletedStage(stageId: number) {
        setCompletedStages((prev) => {
            const next = new Set(prev);
            next.add(stageId);
            return next;
        });
    }

    function openStage(stageId: StageId) {
        if (dataLoading) return;

        setActiveStage(stageId);
        setReadOnly(completedStages.has(stageId));
        setOpen(true);
    }

    function closeStage() {
        setOpen(false);
        setActiveStage(null);
    }

    function setStageAnswer(stageId: StageId, questionId: number, answerOptionId: number) {
        setAnswersByStage((prev) => ({
        ...prev,
        [stageId]: { 
            ...(prev[stageId] ?? {}),
            [questionId]: answerOptionId
        },
        }));
    }

    async function completeStage() {
        if (!activeStage) return;
        if (!userId) {
            onError?.("No user found.");
            return;
        }

        try {
            const selectedAnswers = answersByStage[activeStage] ?? {};
            const rows: Answer[] = questions.map((question) => {
                const answerOptionId = selectedAnswers[question.id];

                if (answerOptionId === undefined) {
                    throw new Error(`Missing answer for question ${question.id}`);
                }

                return {
                    user_id: userId,
                    question_id: question.id,
                    answer_option_id: answerOptionId
                };
            });

            await onPersistStageAnswers(rows);

            setCompletedStages((prev) => {
                const next = new Set(prev);
                next.add(activeStage);
                return next;
            });

            const currentIndex = STAGE_IDS.indexOf(activeStage);
            const nextStage = currentIndex >= 0 ? STAGE_IDS[currentIndex + 1] : null;

            if (nextStage) unlockStage(nextStage);

            closeStage();
        } catch (error) {
            console.error("Failed to save answers", error);
            onError?.("We couldn't save your progress right now.");
        }
    }

    return {
        open,
        activeStage,
        readOnly,
        unlockedStages,
        completedStages,
        answersByStage,
        story,
        questions,
        unlockStage,
        openStage,
        closeStage,
        setStageAnswer,
        completeStage,
        addCompletedStage
    };
}

function deriveStageProgress(restoredAnswers: AnswersByStage) {
    const unlocked = new Set<StageId>();
    const completed = new Set<StageId>();

    const firstStage = STAGE_IDS[0];
    if (firstStage) {
        unlocked.add(firstStage);
    }

    for (let i = 0; i < STAGE_IDS.length; i++) {
        const stageId = STAGE_IDS[i];
        const stageAnswers = restoredAnswers[stageId];

        const hasCompletedStage = stageAnswers && Object.keys(stageAnswers).length > 0;

        if (!hasCompletedStage) break;

        unlocked.add(stageId);
        completed.add(stageId);

        const nextStage = STAGE_IDS[i + 1];
        if (nextStage) {
            unlocked.add(nextStage);
        }
    }

    return {
        unlocked,
        completed
    };
}
