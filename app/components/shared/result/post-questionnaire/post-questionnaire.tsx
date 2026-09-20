"use client";

import { PostQuestion } from "@/model/entities/post-question";
import { LikertValue, PostAnswers } from "@/model/types";

const LIKERT_VALUES: LikertValue[] = [1, 2, 3, 4, 5, 6, 7];

type PostQuestionnaireProps = {
    questions: PostQuestion[];
    answers: PostAnswers;
    onAnswerChange: (questionId: number, value: LikertValue) => void;
    readOnly?: boolean;
};

export function PostQuestionnaire({
    questions,
    answers: answers,
    onAnswerChange: onAnswerChange,
    readOnly = false,
}: PostQuestionnaireProps) {
    return (
        <div className="flex flex-col items-center pb-5">
            <p className="text-center mb-3">Please fill the post questionnaire out to proceed to your results.</p>
            {questions.map((question) => (
                <div
                    key={question.id}
                    className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                    <p className="text-center text-sm font-medium text-ink">{question.text}</p>

                    <div className="mt-4">
                        <div className="grid grid-cols-7 gap-2">
                            {LIKERT_VALUES.map((value) => {
                                const inputId = `post-question-${question.id}-${value}`;
                                return (
                                    <label
                                        key={value}
                                        htmlFor={inputId}
                                        className="flex cursor-pointer flex-col items-center gap-2"
                                    >
                                        <span className="text-xs text-gray-500">{value}</span>
                                        <input
                                            id={inputId}
                                            type="radio"
                                            name={`post-question-${question.id}`}
                                            checked={answers[question.id] === value}
                                            onChange={() => onAnswerChange(question.id, value)}
                                            disabled={readOnly}
                                            className="h-4 w-4 disabled:cursor-not-allowed"
                                            aria-label={`${question.text} - ${value}`}
                                        />
                                    </label>
                                );
                            })}
                        </div>

                        <div className="mt-3 grid grid-cols-3 text-xs text-gray-500">
                            <span className="col-span text-left">Not At All True</span>
                            <span className="col-span text-center">Somewhat True</span>
                            <span className="col-span text-right">Very True</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
