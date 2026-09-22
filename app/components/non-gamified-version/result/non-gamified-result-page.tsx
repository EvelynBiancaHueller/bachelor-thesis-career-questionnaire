"use client";

import { NonGamifiedFrame } from "../non-gamified-frame";
import { FooterButton } from "@/components/shared/overlay/footer-button";
import { PostQuestionnaire } from "@/components/shared/result/post-questionnaire/post-questionnaire";
import { ForwardingPage } from "@/components/shared/result/result-forwarding";
import { ResultScore } from "@/components/shared/result/result-score";
import { PostQuestion } from "@/model/entities/post-question";
import { LikertValue, PostAnswers } from "@/model/types";
import { buildRiasecChartData, calculateResultsForNonGamifiedVersion, getTopThreeResults } from "@/services/results";
import { useState } from "react";

type NonGamifiedResultPageProps = {
    postQuestions: PostQuestion[];
    postAnswers: PostAnswers;
    readOnlyPost: boolean;
    answers: Record<number, number>;
    onAnswerChange: (questionId: number, value: LikertValue) => void;
    onSubmitPostAnswers: () => void;
    onComplete: () => void;
};

type ViewMode = "postQuestionnaire" | "result" | "forward";

export function NonGamifiedResultPage({
    postQuestions,
    postAnswers,
    readOnlyPost,
    answers,
    onAnswerChange,
    onSubmitPostAnswers,
    onComplete
}: NonGamifiedResultPageProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("postQuestionnaire");

    const isPostQuestionnaireCompleted = postQuestions.length > 0 && postQuestions.every((question) => postAnswers[question.id] !== undefined);

    const onNext = () => {
        onSubmitPostAnswers();

        if (viewMode === "postQuestionnaire") {
            setViewMode("result");
        } else if (viewMode === "result") {
            onComplete();
            setViewMode("forward")
        }
    }

    const onBack = () => {
        setViewMode("result");
    }

    const result = calculateResultsForNonGamifiedVersion(answers);

    return (
        <NonGamifiedFrame>

            {viewMode === "postQuestionnaire" ? 
                <PostQuestionnaire
                    questions={postQuestions}
                    answers={postAnswers}
                    onAnswerChange={onAnswerChange}
                    readOnly={readOnlyPost}
                />
            : viewMode === "result" ?
                <>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <h1 className="text-center text-3xl font-normal text-black">
                            Your Results
                        </h1>

                        <div className="mt-6 mb-6 border-t border-black" />

                        <ResultScore
                            riasecData={buildRiasecChartData(result)}
                            topThreeResults={getTopThreeResults(result)}
                        />
                    </div>
                </>
            : <ForwardingPage/>}

            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 pb-5 pt-3">
                <div className="justify-self-start">
                        {viewMode === "forward" ?
                            <FooterButton
                                label="Back"
                                iconSrc="/icons/utility/arrow-left.svg"
                                iconAlt="Back"
                                onClick={onBack}
                                reverse={true}
                            />
                        : null }
                </div>

                <div/>

                <div className="justify-self-end">
                    {viewMode !== "forward" ? 
                        <FooterButton
                            label={"Next"}
                            iconSrc="/icons/utility/arrow-right.svg"
                            iconAlt="Next"
                            onClick={onNext}
                            reverse={false}
                            disabled={!isPostQuestionnaireCompleted}
                        />
                    : null}
                </div>
            </div>
        </NonGamifiedFrame>
    );
}