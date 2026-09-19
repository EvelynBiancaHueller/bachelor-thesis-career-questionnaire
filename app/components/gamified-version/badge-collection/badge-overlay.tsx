import { useEffect, useState } from "react";
import { OverlayShell } from "../../shared/overlay/overlay-shell";
import { Badge } from "@/model/entities/badge";
import { CloseButtonOverlay } from "../../shared/overlay/close-button";

type Overlay = {
    open: boolean;
    onClose: () => void;
    collectedBadgeIds: number[];
    allBadges: Record<number, Badge>;
};

export function BadgeOverlay({ 
    open, 
    onClose,
    collectedBadgeIds,
    allBadges,
}: Overlay) {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    useEffect(() => {
        if (open) setSelectedBadge(null);
    }, [open]);

    if (!open) return null;
    const collectedBadges = collectedBadgeIds.map((id) => allBadges[id]);

    return (
        <OverlayShell onClose={onClose}>
            <div className="relative flex min-h-0 flex-1 flex-col">
                <CloseButtonOverlay onClick={onClose}/>

                <div className="flex flex-col items-center gap-2.5 pt-5">
                    <img
                        src="/icons/badges/badges.svg"
                        alt="Badges"
                        width={70}
                        height={70}
                        style={{ display: "block" }}
                    />
                    <p className="mb-5.5 text-[20px] tracking-[0.08em]">YOUR BADGES</p>
                    
                    
                    <p className="text-center text-l font-light text-ink">Take a look at your collected badges.</p> 
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {collectedBadges.length === 0 ? (
                        <div className="mt-8 text-center text-l font-semibold text-ink">
                            No badges collected yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-6 pt-10 sm:gap-3">
                            {collectedBadges.map((badge) => {
                                const isFlipped = selectedBadge?.id === badge.id;

                                return (
                                    <div key={badge.id} className="flex flex-col items-center text-center">
                                        <button 
                                            type="button"
                                            onClick={() => setSelectedBadge(isFlipped ? null : badge)}
                                            className="block w-full"
                                            aria-pressed={isFlipped}
                                            aria-label={isFlipped ? "Hide badge description" : "Show badge description"}
                                        >
                                            <div
                                                className="relative w-full aspect-[1/1.2] sm:aspect-[1/0.8]"
                                                style={{ perspective: "1000px" }}
                                            >
                                                <div
                                                    className="relative h-full w-full transition-transform duration-500"
                                                    style={{
                                                        transformStyle: "preserve-3d",
                                                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                                    }}
                                                >
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center rounded-2xl border border-gray-100 bg-accent-neutral p-3 shadow-sm"
                                                        style={{ backfaceVisibility: "hidden" }}
                                                    >
                                                        <img
                                                            src={badge.source}
                                                            alt=""
                                                            width={120}
                                                            height={120}
                                                            className="block h-auto w-26"
                                                        />
                                                    </div>

                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm"
                                                        style={{
                                                            backfaceVisibility: "hidden",
                                                            transform: "rotateY(180deg)",
                                                        }}
                                                    >
                                                        <span
                                                            lang="en"
                                                            className="text-[15px] leading-snug text-ink hyphens-auto sm:text-[12px]"
                                                        >
                                                            {badge.description}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </OverlayShell>
    );
}
