"use client";

import { NonGamifiedFrame } from "../non-gamified-frame";
import { FooterButton } from "@/components/shared/overlay/footer-button";
import { Step } from "@/model/types";

type NonGamifiedInfoPageProps = {
    steps: Step[];
    stepIndex: number;
    isNextDisabled?: boolean;
    onPrev: () => void;
    onNext: () => void;
    onComplete: () => Promise<void> | void;
};

export function NonGamifiedInfoPage({
    steps,
    stepIndex,
    isNextDisabled,
    onPrev,
    onNext,
    onComplete,
}: NonGamifiedInfoPageProps) {
    
    const total = steps.length;
    const isFirst = stepIndex === 0;
    const isLast = stepIndex === total - 1;
    const step = steps[stepIndex];

    if (!step) return null;
    return (
        <NonGamifiedFrame>
            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="mt-[clamp(0.5rem,2.5vh,3rem)]">
                    <div className="flex h-[clamp(7rem,16vh,10rem)] shrink-0 flex-col">
                        <h1 className="flex flex-1 items-center justify-center px-8 text-center text-3xl font-normal text-black">
                            {step.title}
                        </h1>
                        <div className="border-t border-black" />
                    </div>

                    <div className="mt-[clamp(1.5rem,4vh,2.5rem)] space-y-5 text-center text-xl leading-relaxed text-neutral-800">
                        {step.body}
                    </div>
                </div>
            </div>

            <div className="shrink-0 mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 pb-5 pt-3">
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

                <div className="text-ink/80 text-xl">
                    {stepIndex + 1} / {total}
                </div>

                <div className="justify-self-end">
                    <FooterButton
                        label={isLast ? "Start" : "Next"}
                        iconSrc="/icons/utility/arrow-right.svg"
                        iconAlt="Next"
                        onClick={isLast ? onComplete : onNext}
                        reverse={false}
                        disabled={isNextDisabled ?? false}
                    />
                </div>
            </div>
        </NonGamifiedFrame>
    );
}