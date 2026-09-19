export const SPECIAL_NODES = {
    0: {
        shortTitle: "INFO",
        title: "INFORMATION",
        iconUnlocked: "/icons/stages/info.svg",
    },
    6: {
        shortTitle: "RESULT",
        title: "RESULT",
        iconUnlocked: "/icons/stages/flag.svg",
    },
    7: {
        shortTitle: "BADGES",
        title: "BADGES",
        iconUnlocked: "/icons/badges/badges.svg",
    },
}

export type SpecialStagelId = keyof typeof SPECIAL_NODES;
