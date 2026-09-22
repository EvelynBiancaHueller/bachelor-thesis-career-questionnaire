"use client"

import { getRiasecColor, RiasecChartItem } from "@/services/results";
import { ResultsChart } from "../result/result-chart";
import { useState } from "react";

const RIASEC_DESCRIPTIONS: Record<string, string> = {
    Realistic: "Realistic interests involve practical, hands-on activities. People with this interest often enjoy working with tools, machines or physical tasks.",
    Investigative: "Investigative interests involve analyzing, researching and solving problems. People with this interest often enjoy science, logic and exploring how things work.",
    Artistic: "Artistic interests involve creativity, self-expression and originality. People with this interest often enjoy art, music or open-ended tasks.",
    Social: "Social interests involve helping, supporting or guiding others. People with this interest often enjow communication, cooperation and interpersonal activities.",
    Enterprising: "Enterprising interests involve leading, persuading or influencing others. People with this interest often enjoy leadership, sales or project work.",
    Conventional: "Conventional interests involve structure, organization and detail-oriented atsks. People with this interest often enjoy working with data, systems and clear processes.",
}

type ResultScoreProps = {
    riasecData: RiasecChartItem[];
    topThreeResults: string[];
};

export function ResultScore({
    riasecData,
    topThreeResults
}: ResultScoreProps) {
    const [expandedResult, setExpandedResult] = useState<string | null>(null);

    function toggleExpanded(result: string) {
        setExpandedResult((current) => current === result ? null : result);
    }
    
    return (
        <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="h-40 w-full shrink-0">
                <ResultsChart data={riasecData} />
            </div>

            <div className="w-full flex flex-col items-center">
                <p className="mb-5 mt-3">Your top three interests are:</p>
                {topThreeResults.map((result) => {
                    const isExpanded = expandedResult === result;

                    return (
                        <div 
                            key={result} 
                            style={{backgroundColor: getRiasecColor(result, riasecData)}} 
                            className="w-full mb-2 rounded-lg border border-gray-100 overflow-hidden"
                        >
                            <button
                                type="button"
                                onClick={() => toggleExpanded(result)}
                                aria-expanded={isExpanded}
                                className="w-full flex items-center justify-center font-bold px-4 py-3"
                            >
                                <span>{result}</span>
                            </button>
                            
                            {isExpanded && (
                                <div className="px-4 pb-4 text-sm font-normal text-center">
                                    {RIASEC_DESCRIPTIONS[result] ?? "No description available for this interest."}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
