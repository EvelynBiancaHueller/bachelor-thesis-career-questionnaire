import { OverlayShell } from "../overlay/overlay-shell";
import { FooterButton } from "../overlay/footer-button";
import { buildRiasecChartData, calculateResults, getTopThreeResults } from "@/services/results";
import { ResultSteps } from "../result/result-steps";
import { AnswersByStage, LikertValue, OpenQuestion, PostAnswers } from "@/model/types";
import { PostQuestion } from "@/model/entities/post-question";
import { CloseButtonOverlay } from "../overlay/close-button";

export type ResultsOverlayProps = {
    readOnlyPost: boolean;
    readOnlyOpen: boolean;
    open: boolean;
    stepIndex: number;
    answersByStage: AnswersByStage;
    postAnswers: PostAnswers;
    postQuestions: PostQuestion[];
    openQuestions: OpenQuestion[];
    openAnswers: Record<string, string>;
    onAnswerChange: (questionId: number, value: LikertValue) => void;
    onOpenAnswerchange: (questionId: number, answer: string) => void;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
    onComplete: () => void;
    onSubmitPostAnswers: () => Promise<void>;
    onSubmitOpenAnswers: () => Promise<void>;
};

export function ResultsOverlay({
    readOnlyPost,
    readOnlyOpen, 
    open, 
    stepIndex,
    answersByStage,
    postAnswers,
    postQuestions,
    openQuestions,
    openAnswers,
    onAnswerChange,
    onOpenAnswerchange,
    onPrev,
    onNext,
    onClose,
    onComplete,
    onSubmitPostAnswers,
    onSubmitOpenAnswers,
}: ResultsOverlayProps) {
    if (!open) return null;
    
    const results = calculateResults(answersByStage);
    const riasecData = buildRiasecChartData(results);
    const topThreeResults = getTopThreeResults(results);

    const steps = ResultSteps({
        riasecData,
        topThreeResults,
        postQuestions: postQuestions,
        postAnswers: postAnswers,
        openQuestions: openQuestions,
        openAnswers: openAnswers,
        readOnlyPost,
        readOnlyOpen,
        onAnswerChange: onAnswerChange,
        onOpenAnswerChange: onOpenAnswerchange,
    });
    
    const total = steps.length;
    const isFirst = stepIndex === 0;
    const isLast = stepIndex === total - 1;
    const step = steps[stepIndex];

    const isPostQuestionnaireCompleted = postQuestions.length > 0 && postQuestions.every((question) => postAnswers[question.id] !== undefined);
    const isPostQuestionnaire = steps[stepIndex]?.id === "post-questionnaire";
    const isPostNextDisabled = isPostQuestionnaire && !isPostQuestionnaireCompleted;

    const isOpenQuestionnaire = steps[stepIndex]?.id === "open-questionnaire";

    const handleNext = async () => {
        if (isLast) {
            onComplete();
            return;
        }

        if (!readOnlyPost && isPostQuestionnaire) {
            await onSubmitPostAnswers();
        }

        if (!readOnlyOpen && isOpenQuestionnaire) {
            await onSubmitOpenAnswers();
        }

        onNext();
        return;
    }

    const nextLabel = handleNextlabel(isLast, isPostQuestionnaire, isOpenQuestionnaire, readOnlyPost);

    return (
        <OverlayShell onClose={onClose}>
            <div className="relative flex min-h-0 flex-1 flex-col">
                {readOnlyOpen ? <CloseButtonOverlay onClick={onClose}/> : null}

                <div className="shrink-0 flex flex-col items-center gap-2.5 pt-5">
                    <img
                        src="/icons/stages/flag.svg"
                        alt="Results"
                        width={70}
                        height={70}
                        style={{ display: "block" }}
                    />
                    <p className="mb-5.5 text-[20px] tracking-[0.08em]">YOUR RESULTS</p>
                    
                    <h2 className="text-center text-xl font-semibold text-ink">
                        {step.title}
                    </h2> 
            </div>

                <div className="min-h-0 flex-1 overflow-y-auto mt-3">
                    {step.body}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 pb-5 pt-3">
                <div className="justify-self-start">
                    {!isFirst ? (
                        <FooterButton
                            label="Back"
                            iconSrc="/icons/utility/arrow-left.svg"
                            iconAlt="Back"
                            onClick={onPrev}
                            disabled={isFirst}
                            reverse={true}
                        />
                    ) : null}
                </div>

                <div className="text-base text-ink/80">
                    {stepIndex + 1} / {total}
                </div>

                <div className="justify-self-end">
                    <FooterButton
                        label={nextLabel}
                        iconSrc="/icons/utility/arrow-right.svg"
                        iconAlt="Next"
                        onClick={handleNext}
                        reverse={false}
                        disabled={isPostNextDisabled ?? false}
                    />
                </div>
            </div>
        </OverlayShell>
    );
}

function handleNextlabel(isLast: boolean, isPostQuestionnaire: boolean, isOpenQuestionnaire: boolean, readOnlyPost: boolean): string {
    if (isLast) return "Complete";
    if (!readOnlyPost && (isPostQuestionnaire || isOpenQuestionnaire)) return "Submit";
    return "Next";
}
