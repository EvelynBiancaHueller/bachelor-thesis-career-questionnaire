"use client";

import { Badge } from "@/model/entities/badge";
import { PostQuestion } from "@/model/entities/post-question";
import { AnswerOption, Question } from "@/model/entities/question";
import { StageData } from "@/model/entities/stage";
import { OpenQuestion } from "@/model/types";
import { getAnswerOptions, getBadges, getOpenQuestions, getPostQuestions, getQuestions, getQuestionsToUnlockBadges, getStageDataMap } from "@/services/queries";
import { useCallback, useEffect, useState } from "react";


export function useGamifiedDataLoader() {
    const [stageDataMap, setStageDataMap] = useState<Record<number, StageData>>({});
    const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
    const [postQuestions, setPostQuestions] = useState<PostQuestion[]>([]);
    const [openQuestions, setOpenQuestions] = useState<OpenQuestion[]>([]);
    const [badges, setBadges] = useState<Record<number, Badge>>({});
    const [questionsToUnlockBadges, setQuestionsToUnlockBadges] = useState<Record<number, number[]>>({});
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);

    const loadInitialData = useCallback(async (isCancelled?: () => boolean) => {
        setDataLoading(true);
        setDataError(null);

        try {
            const [stageDataMap, answerOptions, badges, questionsToUnlockBadges, postQuestionnaire, openQuestionnaire] = await Promise.all([
                getStageDataMap(),
                getAnswerOptions(),
                getBadges(),
                getQuestionsToUnlockBadges(),
                getPostQuestions(),
                getOpenQuestions(),
            ]);
        
            if (isCancelled?.()) return;

            setStageDataMap(stageDataMap);
            setAnswerOptions(answerOptions);
            setBadges(badges);
            setQuestionsToUnlockBadges(questionsToUnlockBadges);
            setPostQuestions(shuffleArray(postQuestionnaire));
            setOpenQuestions(openQuestionnaire);

        } catch (error) {
            if (isCancelled?.()) return;
            setDataError(error instanceof Error ? error.message : "Failed to load data");
        } finally {
            if (isCancelled?.()) return;
            setDataLoading(false);
        } 
    }, []);

    useEffect(() => {
        let cancelled = false;

        loadInitialData(() => cancelled);
        return () => {
            cancelled = true;
        }
    }, [loadInitialData]);

    const reload = useCallback(async () => {
        await loadInitialData(() => false);
    }, [loadInitialData]);

    return {
        stageDataMap,
        answerOptions,
        postQuestions,
        openQuestions,
        badges,
        questionsToUnlockBadges,
        dataLoading,
        dataError,
        setDataError,
    };
}

export function useNonGamifiedDataLoader() {
    const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [postQuestions, setPostQuestions] = useState<PostQuestion[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);

    const loadInitialData = useCallback(async (isCancelled?: () => boolean) => {
        setDataLoading(true);
        setDataError(null);

        try {
            const [answerSet, questionSet, postQuestionnaire] = await Promise.all([
                getAnswerOptions(),
                getQuestions(),
                getPostQuestions(),
            ]);
        
            if (isCancelled?.()) return;

            setAnswerOptions(answerSet);
            setQuestions(questionSet)
            setPostQuestions(shuffleArray(postQuestionnaire));

        } catch (error) {
            if (isCancelled?.()) return;
            setDataError(error instanceof Error ? error.message : "Failed to load data");
        } finally {
            if (isCancelled?.()) return;
            setDataLoading(false);
        } 
    }, []);

    useEffect(() => {
        let cancelled = false;

        loadInitialData(() => cancelled);
        return () => {
            cancelled = true;
        }
    }, [loadInitialData]);

    const reload = useCallback(async () => {
        await loadInitialData(() => false);
    }, [loadInitialData]);

    return {
        answerOptions,
        questions,
        postQuestions,
        dataLoading,
        dataError,
        setDataError,
        reload
    };
}

function shuffleArray(array: PostQuestion[]): PostQuestion[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}
