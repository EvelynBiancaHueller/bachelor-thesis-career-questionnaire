"use client";

import { UseUserResult } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { NonGamifiedInfoPage } from "./info/non-gamified-info-page";
import { NonGamifiedQuestionPage } from "./non-gamified-question-page";
import { useInfo } from "@/hooks/use-info";
import { ProfileData } from "@/model/types";
import { getNonGamifiedInfoSteps } from "./info/non-gamified-info-steps";
import { mapApplicationUserToProfileData } from "@/model/mapper/application-user";
import { useNonGamifiedDataLoader } from "@/hooks/use-data-loader";
import { NonGamifiedResultPage } from "./result/non-gamified-result-page";
import { useResult } from "@/hooks/use-result";
import { insertAnswer, insertPostAnswers } from "@/services/queries";
import { getAnswers } from "@/services/data-restoration";

type NonGamifiedQuestionnaireProps = {
    user: UseUserResult;
};

type ViewMode = "info" | "questions" | "result";

export function NonGamifiedQuestionnaire({user}: NonGamifiedQuestionnaireProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("info");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const data = useNonGamifiedDataLoader();

    const completeInfo = async (profileData: ProfileData) => {
        await user.createUser(profileData, "non-gamified");
        setViewMode("questions");
    }

    const info = useInfo({onComplete: completeInfo});
    
    const infoSteps = getNonGamifiedInfoSteps({
        profileData: info.profileData,
        onProfileChange: info.handleProfileChange,
        readOnly: info.readOnly,
    });


    useEffect(() => {
        if (!user.user) return;

        const userId = user.user.id;

        info.hydrateRestoredProfileData(mapApplicationUserToProfileData(user.user));
        
        let cancelled = false;

        const hydrateAnswers = async () => {
            try {
                const restoredAnswers = await getAnswers(userId);

                if (!cancelled) {
                    setAnswers(restoredAnswers);
                    setViewMode("questions");
                }
            } catch (error) {
                console.error("Failed to restore answers", error);
            }
        };

        hydrateAnswers();

        return () => {cancelled = true;};
    }, [user.user?.id]);

    const questions = data.questions;

    const answerOptions = data.answerOptions;

    const activeQuestion = questions[questionIndex];

    const goToNextQuestion = () => {
        const isLastQuestion = questionIndex === questions.length - 1;

        if (isLastQuestion) {
            insertAnswer(answers, user.userId)
            setViewMode("result");
            return;
        }

        setQuestionIndex((current) => current + 1);
    };

    const goToPrevQuestion = () => {
        if (questionIndex === 0) {
            setViewMode("info");
            return;
        }

        setQuestionIndex((current) => current - 1);
    };

    const handleAnswerChange = (answerOptionId: number) => {
        setAnswers((current) => ({
        ...current,
        [activeQuestion.id]: answerOptionId,
        }));
    };

    const result = useResult({
    userId: user.userId,
    onSubmitPostAnswers: async (answers) => {
        if (!user.userId) throw new Error("No user found.");
        await insertPostAnswers(user.userId, answers);
    }
    });

    if (viewMode === "info") {
        return (
        <NonGamifiedInfoPage
            steps={infoSteps}
            stepIndex={info.stepIndex}
            isNextDisabled={infoSteps[info.stepIndex]?.id === "profile" && !info.isProfileComplete}
            onPrev={info.goToPrevStep}
            onNext={() => info.goToNextStep(infoSteps.length)}
            onComplete={info.complete}
        />
        );
    }

    if (viewMode === "result") {
        return (
            <NonGamifiedResultPage
                postQuestions={data.postQuestions}
                postAnswers={result.postAnswers}
                readOnlyPost={result.readOnlyPost}
                answers={answers}
                onAnswerChange={result.handlePostAnswerChange}
                onSubmitPostAnswers={result.submitPostAnswers}
                onComplete={result.complete}
            />
        );
    }

    return (
        <NonGamifiedQuestionPage
            questionNumber={questionIndex + 1}
            totalQuestions={questions.length}
            questionText={activeQuestion.text}
            answerOptions={answerOptions}
            selectedAnswerId={answers[activeQuestion.id]}
            onAnswerChange={handleAnswerChange}
            onBack={goToPrevQuestion}
            onNext={goToNextQuestion}
            isNextDisabled={!answers[activeQuestion.id]}
            nextLabel={questionIndex === questions.length - 1 ? "Finish" : "Next"}
        />
    );
};