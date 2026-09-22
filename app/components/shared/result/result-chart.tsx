"use client";

import { RiasecChartItem } from "@/services/results";
import { Bar, BarChart, CartesianGrid, Rectangle, Tooltip, XAxis, YAxis } from "recharts";

type CustomBarShapeProps = {
    fill?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    payload?: RiasecChartItem;
};

type ResultChartProps= {
    data: RiasecChartItem[];
};

export function ResultsChart({ data }: ResultChartProps) {
    return (
        <BarChart
            data={data}
            responsive
            style={{ width: "100%", height: "100%" }}
            margin={{ top: 8, right: 40, left: 0, bottom: 8 }}
        >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis 
                dataKey="label"
                interval={0}
                angle={45}
                textAnchor="start"
                height={55}
                tickMargin={2}
                tick={{fontSize: 12}}
            />
            <YAxis allowDecimals={false}/>
            <Tooltip/>
            <Bar dataKey="score" shape={<CustomBarShape/>}/>
        </BarChart>
    );
}

function CustomBarShape(props: CustomBarShapeProps) {
    const { x=0, y=0, width=0, height=0, payload } = props;

    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={payload?.color ?? "#9cc09a"}
            radius={[6, 6, 0, 0]}
        />
    );
}
