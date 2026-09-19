"use client";

import { FooterButton } from "../shared/overlay/footer-button";
import { NonGamifiedFrame } from "./non-gamified-frame";

type AnswerOption = {
  id: number;
  text: string;
};

type NonGamifiedQuestionPageProps = {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  answerOptions: AnswerOption[];
  selectedAnswerId?: number;
  onAnswerChange: (answerOptionId: number) => void;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
};

export function NonGamifiedQuestionPage({
  questionNumber,
  totalQuestions,
  questionText,
  answerOptions,
  selectedAnswerId,
  onAnswerChange,
  onBack,
  onNext,
  isNextDisabled = false,
  nextLabel = "Next",
}: NonGamifiedQuestionPageProps) {
  return (
    <NonGamifiedFrame>
      <div className="mt-25">
        <div className="flex h-[clamp(7rem,16vh,10rem)] shrink-0 flex-col">
          <h1 className="flex flex-1 items-center justify-center overflow-y-auto px-8 text-center text-2xl font-normal text-black">
            {questionText}
          </h1>

          <div className="border-t border-black" />
        </div>

        <fieldset className="mt-14 space-y-7">
          {answerOptions.map((option) => {
            const selected = selectedAnswerId === option.id;

            return (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-9 text-xl text-black pr-13 pl-13"
              >
                <input
                  type="radio"
                  name={`question-${questionNumber}`}
                  value={option.id}
                  checked={selected}
                  onChange={() => onAnswerChange(option.id)}
                  className="sr-only"
                />

                <div className="flex cursor-pointer items-center gap-9 text-xl text-black">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-black`}>
                    {selected ? (
                      <span className={`h-6 w-6 rounded-full bg-black`} />
                    ) : null}
                  </span>

                  <span>{option.text}</span>
                </div>
              </label>
            );
          })}
        </fieldset>
      </div>

      <div className="mt-auto grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 pb-5 pt-3">
        <div className="justify-self-start">
            {questionNumber !== 1 ?
              <FooterButton
                label="Back"
                iconSrc="/icons/utility/arrow-left.svg"
                iconAlt="Back"
                onClick={onBack}
                reverse={true}
              />
            : null }
        </div>

        <div className="text-xl text-ink/80">
          {questionNumber} / {totalQuestions}
        </div>

        <div className="justify-self-end">
            <FooterButton
              label={nextLabel}
              iconSrc="/icons/utility/arrow-right.svg"
              iconAlt="Next"
              onClick={onNext}
              reverse={false}
              disabled={isNextDisabled ?? false}
            />
        </div>
      </div>
    </NonGamifiedFrame>
  );
}
