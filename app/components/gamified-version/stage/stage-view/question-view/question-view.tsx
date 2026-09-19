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
            <div className="mt-5 sm:mt-8 md:mt-10 flex flex-col items-center">
                <div className="mb-1 text-center text-sm text-ink">
                    {percent}%
                </div>

                <div className="h-3 w-[85%] rounded-full bg-accent-neutral border border-gray-100">
                    <div className="h-full rounded-full bg-accent-green" style={{ width: `${progress * 100}%` }}/>
                </div>

                <div className="mt-10 mb-8 flex w-full flex-col items-center gap-6 px-3 sm:mt-12 sm:mb-8 sm:gap-8 md:mt-16 md:gap-10">
                    <div className="max-w-120 text-center text-[18px] text-ink sm:text-[20px]">
                        {question?.text ?? "No question loaded"} 
                    </div>

                    <AnswerRow readOnly={readOnly} selected={selected} answerOptions={answerOptions} onSelect={onSelect}/>

                    {question?.imagery ? (
                        <img
                            src={question.imagery}
                            alt=""
                            className="block h-auto w-[36%] max-w-105 min-w-30 sm:w-[40%] mt-5"
                        />
                    ): null}
                </div>
            </div>
        </div>
    );
}
