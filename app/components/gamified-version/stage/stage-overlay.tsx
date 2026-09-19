"use client"

import { useEffect, useState } from "react";
import { OverlayShell } from "@/components/shared/overlay/overlay-shell";
import { FooterButton } from "@/components/shared/overlay/footer-button";
import { Story } from "@/model/entities/stage";
import { AnswerOption, Question } from "@/model/entities/question";
import { CloseButtonOverlay } from "@/components/shared/overlay/close-button";
import { LOCKED_ICON, StageId } from "./constants";
import { SingleStageAnswer } from "@/model/types";
import { QuestionPage } from "./stage-view/question-view/question-view";
import { IntroPage } from "./stage-view/intro-view";

type ViewMode = "intro" | "questions";

type StageOverlayProps = {
    open: boolean;
    stageId: StageId | null;
    story: Story | null;
    questions: Question[];
    answerOptions: AnswerOption[];
    answers: SingleStageAnswer;
    onAnswerChange: (questionId: number, answerOptionId: number) => void;
    onClose: () => void;
    onComplete: () => Promise<void> | void;
    readOnly: boolean
};

export function StageOverlay({
    open,
    stageId,
    story,
    questions,
    answerOptions,
    answers,
    onAnswerChange,
    onClose,
    onComplete,
    readOnly = false
}: StageOverlayProps) {
    const [view, setView] = useState<ViewMode>("intro");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (open) {
            setView("intro");
            setIndex(0);
        }
    }, [open, stageId]);

    if (!open || !stageId) return null;

    const total = questions.length;
    const question = questions[index];
    const selected = question ? answers[question.id] : undefined;
    
    const isIntro = view === "intro";
    const isFirst = index === 0;
    const isLast = index === total - 1;
    
    const disableNext = !readOnly && !isIntro && selected === undefined;
    const nextLabel = isIntro ? "Start" : isLast ? "Complete" : "Next";

    const introIcon = story?.source ?? LOCKED_ICON;
    const introTitle = story?.title ?? "";
    const introStory = story?.description ?? null;

    const handleBack = () => {
        if (isIntro) {
            onClose();
            return;
        }

        if (isFirst) {
            setView("intro");
            return;
        }

        setIndex((i) => i - 1);
    }

    const handleNext = async () => {
        if (isIntro) {
            if (total === 0) {
                if (readOnly) {
                    onClose();
                    return;
                }
                await onComplete();
                return;
            }

            setView("questions");
            setIndex(0);
            return;
        }

        if (!question) return;
        if (!readOnly && selected === undefined) return;

        if (isLast) {
            if (readOnly) {
                onClose();
                return;
            }
            await onComplete();
            return;
        }

        setIndex((i) => i + 1);
    }

    return (
        <OverlayShell onClose={onClose}>
            <div className="relative min-h-0 flex flex-1 flex-col overflow-hidden">
                {readOnly ? <CloseButtonOverlay onClick={onClose}/> : null}
                
                {isIntro ? (
                    <div className="flex flex-1 flex-col min-h-0">
                        <IntroPage
                        title={introTitle}
                        icon={introIcon}
                        story={introStory}
                        />
                    </div>
                ) : (
                    <QuestionPage
                        readOnly={readOnly}
                        total={total}
                        index={index}
                        question={question}
                        selected={selected}
                        answerOptions={answerOptions}
                        onSelect={(answerOptionId) => {
                            if (!readOnly && question) onAnswerChange(question.id, answerOptionId);
                            }
                        }
                    />
                )}
            </div>
            
            <div className="mt-4 grid grid-cols-2 items-center gap-x-3 pb-5 pt-3">
                <div className="justify-self-start">
                    {!isIntro ? (
                        <FooterButton
                            label="Back"
                            iconSrc="/icons/utility/arrow-left.svg"
                            iconAlt="Back"
                            onClick={handleBack}
                            reverse={true}
                        />
                    ) : null}
                </div>

                <div className="justify-self-end">
                    <FooterButton
                        label={nextLabel}
                        iconSrc="/icons/utility/arrow-right.svg"
                        iconAlt="Next"
                        onClick={handleNext}
                        reverse={false}
                        disabled={disableNext}
                    />
                </div>
            </div>
        </OverlayShell>
    );
}
