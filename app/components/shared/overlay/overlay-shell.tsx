"use client";

import { ReactNode, useEffect } from "react";

type Props = {
    children: ReactNode;
    onClose: () => void;
};

export function OverlayShell({ children, onClose }: Props) {
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    return ( 
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <div 
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()} 
                className="flex h-[90dvh] w-full max-w-130 flex-col overflow-hidden rounded-2xl bg-background p-4"
            >
                {children}
            </div>
        </div>
    );
}
