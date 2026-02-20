import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiText } from '@elastic/eui';

import { AggregationResultsData, VisualizationType } from '@/types';

import { WfoAgentLineChart } from '../WfoAgentChart/WfoAgentLineChart';
import { WfoAgentPieChart } from '../WfoAgentChart/WfoAgentPieChart';
import { WfoAgentTable } from '../WfoAgentTable';

export type WfoAgentVisualizationProps = {
    aggregationData: AggregationResultsData;
};

export function WfoAgentVisualization({
    aggregationData,
}: WfoAgentVisualizationProps) {
    const { visualization_type, results } = aggregationData;
    const t = useTranslations('agent.page.visualization');

    if (!results || results.length === 0) {
        return null;
    }

    // For charts (pie/line), validate data structure
    const visualizationType = visualization_type?.type;
    if (
        visualizationType === VisualizationType.PIE ||
        visualizationType === VisualizationType.LINE
    ) {
        const firstResult = results[0];
        const groupKeys = Object.keys(firstResult.group_values);
        const aggKeys = Object.keys(firstResult.aggregations);

        if (groupKeys.length === 0 || aggKeys.length === 0) {
            return null;
        }
    }

    switch (visualizationType) {
        case VisualizationType.PIE:
            return <WfoAgentPieChart aggregationData={aggregationData} />;
        case VisualizationType.LINE:
            return <WfoAgentLineChart aggregationData={aggregationData} />;
        case VisualizationType.TABLE:
        default:
            return <WfoAgentTable aggregationData={aggregationData} />;
    }
}
