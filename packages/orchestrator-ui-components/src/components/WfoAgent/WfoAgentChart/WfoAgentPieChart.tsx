import React from 'react';

import '@elastic/charts/dist/theme_only_light.css';
import {
    Chart,
    DARK_THEME,
    LIGHT_THEME,
    Partition,
    PartitionLayout,
    Position,
    Settings,
} from '@elastic/charts';

import { AggregationResultsData } from '@/types';

import { useOrchestratorTheme } from '../../../hooks';
import { containerStyle } from './styles';

export type WfoAgentPieChartProps = {
    aggregationData: AggregationResultsData;
};

export function WfoAgentPieChart({ aggregationData }: WfoAgentPieChartProps) {
    const { results } = aggregationData;
    const { isDarkThemeActive, multiplyByBaseUnit } = useOrchestratorTheme();
    const chartBaseTheme = isDarkThemeActive ? DARK_THEME : LIGHT_THEME;

    const firstResult = results[0];
    const groupKeys = Object.keys(firstResult.group_values);
    const aggKeys = Object.keys(firstResult.aggregations);

    // Use the first group key for labels and first aggregation for values
    const groupKey = groupKeys[0];
    const aggKey = aggKeys[0];
    const pieData = results.map((result) => ({
        label: result.group_values[groupKey],
        value: result.aggregations[aggKey],
    }));

    return (
        <div css={containerStyle}>
            <Chart size={{ height: multiplyByBaseUnit(25) }}>
                <Settings
                    showLegend
                    legendPosition={Position.Right}
                    baseTheme={chartBaseTheme}
                />
                <Partition
                    id="pieByPR"
                    data={pieData}
                    layout={PartitionLayout.sunburst}
                    valueAccessor={(d) => d.value}
                    layers={[
                        {
                            groupByRollup: (d: (typeof pieData)[0]) => d.label,
                            shape: {
                                fillColor: (_, sortIndex) =>
                                    chartBaseTheme.colors.vizColors![sortIndex],
                            },
                        },
                    ]}
                    clockwiseSectors={false}
                />
            </Chart>
        </div>
    );
}
