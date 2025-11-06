import React from 'react';

import {
    Axis,
    Chart,
    DARK_THEME,
    LIGHT_THEME,
    LineSeries,
    Position,
    Settings,
} from '@elastic/charts';

import { useOrchestratorTheme } from '@/hooks';
import { AggregationResultsData } from '@/types';

export type WfoAgentLineChartProps = {
    aggregationData: AggregationResultsData;
};

export function WfoAgentLineChart({ aggregationData }: WfoAgentLineChartProps) {
    const { results } = aggregationData;
    const { isDarkThemeActive, multiplyByBaseUnit } = useOrchestratorTheme();
    const chartBaseTheme = isDarkThemeActive ? DARK_THEME : LIGHT_THEME;

    const firstResult = results[0];
    const groupKeys = Object.keys(firstResult.group_values);
    const aggKeys = Object.keys(firstResult.aggregations);

    const xKey = groupKeys[0];
    const chartData = results.map((result, index) => ({
        x: index,
        xLabel: result.group_values[xKey],
        ...result.aggregations,
    }));

    return (
        <Chart size={{ height: multiplyByBaseUnit(30) }}>
            <Settings showLegend baseTheme={chartBaseTheme} />
            <Axis
                id="bottom"
                position={Position.Bottom}
                title={xKey.replace(/_/g, ' ')}
                tickFormat={(d) => chartData[d]?.xLabel?.split(' ')[0] || d}
            />
            <Axis id="left" position={Position.Left} title="Count" />
            {aggKeys.map((aggKey) => (
                <LineSeries
                    key={aggKey}
                    id={aggKey}
                    name={aggKey
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    data={chartData}
                    xAccessor="x"
                    yAccessors={[aggKey]}
                />
            ))}
        </Chart>
    );
}
