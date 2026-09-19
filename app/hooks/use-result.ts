"use client";

import { LikertValue, OpenAnswers, PostAnswers } from "@/model/types";
import { signOut } from "@/services/authentication";
import { getOpenAnswers, getPostAnswers } from "@/services/data-restoration";
import { useEffect, useState } from "react";

type UseResultOptions = {
    userId: number | null;
    onSubmitPostAnswers?: (postanswer: PostAnswers) => Promise<void> | void;
    onSubmitOpenAnswers?: (openAnswer: OpenAnswers) => Promise<void> | void;
    onError?: (message: string) => void;
}

export function useResult(options: UseResultOptions) {
    const { userId, onSubmitPostAnswers, onSubmitOpenAnswers, onError } = options;
    
    const [open, setOpen] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [readOnlyPost, setReadOnlyPost] = useState(false);
    const [readOnlyOpen, setReadOnlyOpen] = useState(false);
    const [postAnswers, setPostAnswers] = useState<PostAnswers>({});
    const [openAnswers, setOpenAnswers] = useState<Record<number, string>>({});

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;

        async function hydratePostAnswers() {
            try {
                const restoredPostAnswers = await getPostAnswers(Number(userId));
                const restoredOpenAnswers = await getOpenAnswers(Number(userId));

                if (cancelled) return;

                setPostAnswers(restoredPostAnswers);
                setOpenAnswers(restoredOpenAnswers);

                if (Object.keys(restoredPostAnswers).length > 0) {
                    setReadOnlyPost(true);
                }

                if (Object.keys(restoredOpenAnswers).length > 0) {
                    setReadOnlyOpen(true);
                }
            } catch (error) {
                console.error("Failed to restore post or open questionnaire answers", error);
                onError?.("We couldn't restore your progress right now.");
            }
        }

        void hydratePostAnswers();

        return () => {
            cancelled = true;
        }
    }, [userId]);

    function openResult() {
        setStepIndex(0);
        setOpen(true);
    }
    
    function closeResult() {
        setOpen(false);
        setStepIndex(0);
    }

    async function complete() {
        closeResult();

        try {
            await signOut();
        } catch (error) {
            console.error("Failed to end session", error);
        }
    }

    function goToPrevStep() {
        setStepIndex((i) => Math.max(0, i - 1));
    }
    
    function goToNextStep() {
        setStepIndex((i) => i + 1);
    }

    function handlePostAnswerChange(questionId: number, value: LikertValue) {
        setPostAnswers((prev) => ({
          ...prev,
          [questionId]: value,
        }))
    }

    function handleOpenAnswerChange(questionId: number, answer: string) {
        setOpenAnswers((prev) => ({
          ...prev,
          [questionId]: answer,
        }))
    }

    async function submitPostAnswers() {
        try {
            await onSubmitPostAnswers?.(postAnswers);
            setReadOnlyPost(true);
        } catch (error) {
            console.error("Failed to save post answers", error);
            onError?.("We couldn't save your progress right now.");
        }
    }

    async function submitOpenAnswers() {
        try {
            await onSubmitOpenAnswers?.(openAnswers);
            setReadOnlyOpen(true);
        } catch (error) {
            console.error("Failed to save open answers", error);
            onError?.("We couldn't save your progress right now.");
        }
    }

    return {
        open,
        stepIndex,
        readOnlyPost,
        readOnlyOpen,
        postAnswers,
        openAnswers,
        openResult,
        closeResult,
        complete,
        goToPrevStep,
        goToNextStep,
        handlePostAnswerChange,
        handleOpenAnswerChange,
        submitPostAnswers,
        submitOpenAnswers,
    };
}
