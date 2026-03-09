import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiLoadingSpinner, EuiText } from '@elastic/eui';

import { useGetAgentQueryResultsQuery } from '@/rtk/endpoints/agentQueryResults';
import { QueryArtifact } from '@/types';

import { WfoAgentVisualization } from '../WfoAgentVisualization';

export type WfoQueryArtifactProps = {
    artifact: QueryArtifact;
};

export function WfoQueryArtifact({ artifact }: WfoQueryArtifactProps) {
    const t = useTranslations('agent.page.visualization');
    const { data, isLoading, isError } = useGetAgentQueryResultsQuery(
        artifact.query_id,
    );

    if (isLoading) {
        return <EuiLoadingSpinner size="m" />;
    }

    if (isError || !data) {
        return (
            <EuiText size="s" color="danger">
                <p>{t('noDataAvailable')}</p>
            </EuiText>
        );
    }

    // Use the visualization_type from the artifact (set by the LLM) rather than the response
    const aggregationData = {
        ...data,
        visualization_type: artifact.visualization_type,
    };

    return <WfoAgentVisualization aggregationData={aggregationData} />;
}
