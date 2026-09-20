"use client";

import { OpenAnswers, OpenQuestion } from "@/model/types";

type OpenQuestionProps = {
    questions: OpenQuestion[];
    answers: OpenAnswers;
    readOnly?: boolean;
    onAnswerChange: (questionId: number, answer: string) => void;
};

export function OpenEndedQuestion({
    questions,
    answers,
    readOnly = false,
    onAnswerChange,
}: OpenQuestionProps) {
    return (
        <div className="flex max-h-[50vh] min-h-0 flex-col overflow-y-auto pr-2 pl-2 pb-5">
            <p className="text-center mb-3">We would greatly appreciate your answers to the following open questions. They can provide valuable qualitatiev insights, but you are also welcome to skip them and continue to your results.</p>
            <div className="space-y-6">
                {questions.map((question, index) => {
                    const answerKey = question.id;

                    return (
                        <div key={answerKey}>
                            <p className="mt-5 mb-3 font-medium text-ink">
                                {index + 1}. {question.text}
                            </p>

                            {readOnly ? (
                                <div className="min-h rounded-xl bg-gray-50 shadow-sm px-4 py-3 text-base text-ink">
                                    {answers[answerKey] !== "" ? (
                                        <p>{answers[answerKey]}</p>
                                    ) : (
                                        <p className="italic text-gray-400">No answer provided.</p>
                                    )}
                                </div>
                            ) : (
                                <textarea
                                    value={answers[answerKey] ?? ""}
                                    onChange={(e) => onAnswerChange(answerKey, e.target.value)}
                                    rows={5}
                                    placeholder="Type your answer here..."
                                    className="w-full resize-none rounded-2xl border border-gray-100 p-4 text-base text-ink shadow-sm outline-none transition focus:border-gray-300"
                                />
                            )}
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
