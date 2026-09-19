"use client";

type CloseButtonOverlayProps = {
    onClick: () => void;
    label?: string
};

export function CloseButtonOverlay({
    onClick,
    label = "Close overlay"
}: CloseButtonOverlayProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="close"
            className="absolute rounded-full border border-gray-300 top-0 right-0 h-10 w-10 items-center justify-center text-2xl leading-none text-ink"
        >
            X
        </button>
    )
}
