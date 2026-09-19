"use client";

type Props = {
    label: string;
    iconSrc: string;
    iconAlt: string;
    onClick: () => void;
    reverse?: boolean;
    disabled?: boolean;
};

export function FooterButton({
    label,
    iconSrc,
    iconAlt,
    onClick,
    reverse = false,
    disabled = false,
}: Props) {
    const icon = (
        <img 
            src={iconSrc} 
            alt={iconAlt} 
            width={44} 
            height={44} 
            className="block shrink-0"
        />
    );

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex h-11 text-xl items-center justify-center gap-1 bg-transparent transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
            {reverse ? icon : null}
            <span>{label}</span>
            {!reverse ? icon : null}
        </button>
    );
}
