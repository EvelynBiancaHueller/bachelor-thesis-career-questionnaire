"use client"

import { OverlayShell } from "../../shared/overlay/overlay-shell";
import { FooterButton } from "../../shared/overlay/footer-button";
import { CloseButtonOverlay } from "../../shared/overlay/close-button";
import { Step } from "@/model/types";
import { useEffect, useRef } from "react";

export type InfoOverlayProps = {
    readOnly: boolean;
    open: boolean;
    onClose: () => void;
    steps: Step[];
    stepIndex: number;
    onPrev: () => void;
    onNext: () => void;
    onComplete: () => Promise<void> | void;
    isNextDisabled?: boolean;
};

export function InfoOverlay({
    readOnly, 
    open, 
    onClose,
    steps,
    stepIndex,
    onPrev,
    onNext,
    onComplete,
    isNextDisabled,
}: InfoOverlayProps) {
    if (!open) return null;

    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "auto"
        });
    }, [stepIndex, open]);

    const total = steps.length;
    const isFirst = stepIndex === 0;
    const isLast = stepIndex === total - 1;
    const step = steps[stepIndex];

    if (!step) return null;

    return (
        <OverlayShell onClose={onClose}>
            <div className="relative min-h-0 flex flex-1 flex-col">
                {readOnly ? <CloseButtonOverlay onClick={onClose}/> : null}

                <div className="shrink-0 flex flex-col items-center gap-2.5 pt-5">
                    <img
                        src="/icons/stages/info.svg"
                        alt="Info"
                        width={70}
                        height={70}
                        style={{ display: "block" }}
                    />
                    <p className="mb-2 sm:mb-4 md:mb-5 text-[20px] tracking-[0.08em]">INFORMATION</p>
                    
                    {step.title ? (
                        <h2 className="text-center text-xl font-semibold text-ink">
                            {step.title}
                        </h2> 
                    ) : null}
                </div>

                <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto">
                    <div className="mb-10 mt-6.25 flex flex-col items-center gap-2.5">
                        <div className="text-center text-[18px] leading-relaxed text-ink">
                            {step.body}
                        </div>
                    </div>
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
                        label={isLast ? "Let's start" : "Next"}
                        iconSrc="/icons/utility/arrow-right.svg"
                        iconAlt="Next"
                        onClick={isLast ? onComplete : onNext}
                        reverse={false}
                        disabled={isNextDisabled ?? false}
                    />
                </div>
            </div>
        </OverlayShell>
    );
}
