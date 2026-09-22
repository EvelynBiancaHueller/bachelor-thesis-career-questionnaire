import { Story } from "@/model/entities/stage";
import { LOCKED_ICON, STAGE_IDS, StageId } from "../stage/constants";
import { SPECIAL_NODES } from "./roadmap-special-nodes.ts";

type RoadmapNode = {
    id: number;
    x: number;
    y: number;
    label?: string;
    isStage?: boolean;
    labelPos?: {
        x?: number;
        y?: number;
        anchor?: "start" | "middle" | "end";
    }
};

const nodes: RoadmapNode[] = [
    { id: 0, x: 140, y: 840, isStage: true, label: "INFO", labelPos: { x: -25, y: 60, anchor: "end" } },
    { id: 1, x: 240, y: 700, isStage: true, label: "SMALL TOWN", labelPos: { x: 0, y: 60, anchor: "end" } },
    { id: 2, x: 90, y: 570, isStage: true, label: "SCIENCE FESTIVAL", labelPos: { x: 120, y: 60, anchor: "end" } },
    { id: 3, x: 200, y: 420, isStage: true, label: "CITY", labelPos: { x: 10, y: 60, anchor: "end" } },
    { id: 4, x: 80, y: 320, isStage: true, label: "MEDIA & HEALTH EVENT", labelPos: { x: 160, y: 60, anchor: "end" } },
    { id: 5, x: 240, y: 220, isStage: true, label: "CORPORATION", labelPos: { x: -10, y: 55, anchor: "end" } },
    { id: 6, x: 120, y: 120, isStage: true, label: "RESULT", labelPos: { x: 75, y: 60, anchor: "end" } },
    { id: 7, x: 260, y: 60, isStage: false },
];

const routePath = (
  "M 120 140 " +
  "C 60 300, 190 210, 240 220 " +
  "C 280 300, 200 350, 80 320 " +
  "C 0 350, 140 540, 200 430 " +
  "C 400 620, 230 610, 90 570 " +
  "C 60 670, -20 740, 240 700 " +
  "C 300 800, 140 920, 140 840 "
);

type Props = {
    unlockedStages: Set<number>;
    storiesById: Record<number, Story>;
    completedStages: Set<number>;
    onInfoClick: () => void;
    onStageClick: (stageId: StageId) => void;
    onBadgeClick: () => void;
    onResultsClick: () => void;
}

export function Roadmap({ 
    unlockedStages, 
    storiesById, 
    completedStages,
    onInfoClick, 
    onStageClick, 
    onBadgeClick, 
    onResultsClick 
}: Props) {
    return (
        <div className="mx-auto w-full max-w-105">
            <svg
                viewBox="0 0 320 960"
                className="h-auto w-full"
                role="img"
                aria-label="Roadmap"
                >

                <path
                    d={routePath}
                    className="fill-none stroke-path-green"
                    strokeWidth="2"
                    strokeLinecap="round"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                    strokeDasharray="8 10"
                    />

                {nodes.map((n) => {
                    const href = getNodeHref(n, unlockedStages, storiesById);
                    const cursor = getCursor(n, unlockedStages);
                    const onClick = onClickHandler(n, unlockedStages, completedStages, onInfoClick, onStageClick, onBadgeClick, onResultsClick);

                    return (
                        <g
                        key={n.id}
                        transform={`translate(${n.x}, ${n.y})`}
                        style={{ cursor }}
                        onClick={onClick}
                        >
                            {n.isStage && (
                                <ellipse cx="0" cy="26" rx="36" ry="14" className="fill-accent-green" />
                            )}

                            <NodeIcon href={href} nodeId={n.id} />

                            {n.label ? (
                                <text
                                x={n.labelPos?.x ?? 0}
                                y={n.labelPos?.y ?? -22}
                                textAnchor={n.labelPos?.anchor ?? "middle"}
                                fontSize="12"
                                className="fill-ink"
                                style={{ letterSpacing: "0.08em" }}
                                >
                                {n.label}
                                </text>
                            ) : null}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

function NodeIcon({ href, nodeId }: { href: string; nodeId?: number }) {
    if (nodeId === 6) return <image href={href} x={-48} y={-32} width={60} height={60}/>;
    return <image href={href} x={-30} y={-30} width={60} height={60}/>;
}

function isStageNodeId(id: number): id is StageId {
    return STAGE_IDS.includes(id as StageId);
}

function isSpecialNodeId(id: number): id is keyof typeof SPECIAL_NODES {
    return id in SPECIAL_NODES;
}

function getNodeHref(node: RoadmapNode, unlockedStages: Set<number>, storiesById: Record<number, Story>): string {
    if (isStageNodeId(node.id)) {
        if (!unlockedStages.has(node.id)) return LOCKED_ICON;
        return storiesById[node.id]?.source ?? LOCKED_ICON;
    }

    if (isSpecialNodeId(node.id)) return SPECIAL_NODES[node.id].iconUnlocked ?? LOCKED_ICON;

    return LOCKED_ICON;
}

function getCursor(node: RoadmapNode, unlockedStages: Set<number>): "pointer" | "default" {
    if (node.id === 0 || node.id === 7) return "pointer";
    if (isStageNodeId(node.id) && unlockedStages.has(node.id)) return "pointer";
    return "default";
}

function onClickHandler(node: RoadmapNode, unlockedStages: Set<number>, completedStages: Set<number>, onInfoClick: () => void, onStageClick: (stageId: StageId) => void, onBadgeClick: () => void, onResultsClick: () => void) {
    const allStagesCompleted = STAGE_IDS.every((stageId) => completedStages.has(stageId));
    
    if (node.id === 0) return onInfoClick;
    if (node.id === 6 && allStagesCompleted) return onResultsClick;
    if (node.id === 7) return onBadgeClick;
    if (isStageNodeId(node.id) && unlockedStages.has(node.id)) return () => onStageClick(node.id as StageId);
    
    return undefined;
}
