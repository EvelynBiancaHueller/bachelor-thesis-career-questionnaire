import { AnswerOption, Question } from "@/model/entities/question";
import { AnswerRow } from "./answer-row";

type QuestionPageProps = {
    readOnly: boolean;
    total: number;
    index: number;
    question?: Question;
    selected?: number;
    answerOptions: AnswerOption[];
    onSelect: (answerOptionId: number) => void;
};

export function QuestionPage({
    readOnly,
    total,
    index,
    question,
    selected,
    answerOptions,
    onSelect,
}: QuestionPageProps) {
    const progress = total > 0 ? (index + 1) / total : 0;
    const percent = total > 0 ? Math.round(progress * 100) : 0;

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="shrink-0 pt-12 sm:pt-14 md:pt-16">
                <div className="mb-1 text-center text-sm text-ink">
                    {percent}%
                </div>

                <div className="mx-auto h-3 w-[85%] rounded-full border border-gray-100 bg-accent-neutral">
                    <div
                        className="h-full rounded-full bg-accent-green"
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-3">
                <div className="my-auto flex w-full flex-col items-center gap-[clamp(2.5rem,6vh,4rem)] py-8 sm:gap-8 md:gap-10">
                    <div className="flex h-14 max-w-120 items-center justify-center text-center text-[18px] leading-snug text-ink sm:h-16 sm:text-[20px]">
                        {question?.text ?? "No question loaded"}
                    </div>

                    <AnswerRow
                        readOnly={readOnly}
                        selected={selected}
                        answerOptions={answerOptions}
                        onSelect={onSelect}
                    />
                </div>
            </div>
        </div>
    );
}
