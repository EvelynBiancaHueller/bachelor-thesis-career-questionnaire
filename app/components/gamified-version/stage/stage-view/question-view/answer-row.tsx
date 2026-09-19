import { AnswerOption } from "@/model/entities/question";

type AnswerColorTone = "negative" | "neutral" | "positive";

export function AnswerRow({
    readOnly,
    selected,
    answerOptions,
    onSelect,
}: {
    readOnly: boolean;
    selected: number | undefined;
    answerOptions: AnswerOption[];
    onSelect: (answerOptionId: number) => void;
}) {
    return (
        <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
            {answerOptions.map((option) => {
                const isSelected = selected === option.id;
                const styling = getAnswerOptionStyling(option.value);
                const tone = getToneStyles(styling.colorTone);
                
                return (
                    <label key={option.id} className={`flex flex-col items-center justify-center gap-3 sm:gap-1.25 ${readOnly ? "cursor-default" : "cursor-pointer"}`}>
                        <input
                            type="radio"
                            name="answer"
                            checked={isSelected}
                            onChange={() => {
                                if (!readOnly) onSelect(option.id);
                            }}
                            className="hidden"
                        />
                        <span className="flex items-center justify-center sm:h-15 md:h-20">
                            <span 
                                className={`flex items-center justify-center rounded-full border-2 ${tone.border} ${isSelected ? tone.bg : "bg-transparent"}`}
                                style={{
                                    width: styling.size,
                                    height: styling.size,
                                }}
                            >
                                {isSelected ? (
                                    <img
                                        src="/icons/utility/checked.svg"
                                        alt="checked"
                                        className="block h-[55%] w-[70%]"
                                    />
                                ) : null}
                            </span>
                        </span>

                        <span className={`max-w-15.5 text-center text-[10px] leading-[1.15] sm:max-w-17.5 sm:text-[11px] md:max-w-19.5 md:text-[14px] ${tone.text}`}>
                            {option.text}
                        </span>
                    </label>
                );
            })}
        </div>
    );
}

function getAnswerOptionStyling(value: number) {
    switch (value) {
        case 0: return { size: 60, colorTone: "negative" as const};
        case 1: return { size: 45, colorTone: "negative" as const};
        case 2: return { size: 30, colorTone: "neutral" as const};
        case 3: return { size: 45, colorTone: "positive" as const};
        case 4: return { size: 60, colorTone: "positive" as const};
        default: return { size: 30, colorTone: "neutral" as const};
    }
}

function getToneStyles(colorTone: AnswerColorTone) {
    switch (colorTone) {
        case "negative":
            return {
                text: "text-answer-negative",
                border: "border-answer-negative",
                bg: "bg-answer-negative",
            };
        case "neutral":
            return {
                text: "text-answer-neutral",
                border: "border-answer-neutral",
                bg: "bg-answer-neutral",
            };
        case "positive":
            return {
                text: "text-answer-positive",
                border: "border-answer-positive",
                bg: "bg-answer-positive",
            };
    }
}
