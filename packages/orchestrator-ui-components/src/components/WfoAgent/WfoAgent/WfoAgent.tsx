import React from 'react';

import { useTranslations } from 'next-intl';

import { useCoAgent, useCoAgentStateRender } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import { WfoSearchResults } from '@/components/WfoSearchPage/WfoSearchResults';
import { AnySearchParameters, Group, PathFilter, SearchResult } from '@/types';

import { ExportButton, ExportData } from '../ExportButton';
import { FilterDisplay } from '../FilterDisplay';

type SearchResultsData = {
    action: string;
    query_id: string;
    results_url: string;
    total_count: number;
    message: string;
    results: SearchResult[];
};

type SearchState = {
    run_id?: string | null;
    query_id?: string | null;
    parameters: AnySearchParameters | null;
    results_data?: SearchResultsData | null;
    export_data?: ExportData | null;
};

const initialState: SearchState = {
    run_id: null,
    query_id: null,
    parameters: null,
    results_data: null,
    export_data: null,
};

export function WfoAgent() {
    const t = useTranslations('agent');
    const tPage = useTranslations('agent.page');

    const { state } = useCoAgent<SearchState>({
        name: 'query_agent',
        initialState,
    });
    const { parameters, results_data } = state;

    useCoAgentStateRender<SearchState>({
        name: 'query_agent',
        render: ({ state }) => {
            if (!state.export_data || state.export_data.action !== 'export') {
                return null;
            }
            return <ExportButton exportData={state.export_data} />;
        },
    });

    const displayParameters = parameters
        ? {
              ...parameters,
              filters: Array.isArray(parameters.filters)
                  ? ({ op: 'AND' as const, children: parameters.filters } as Group)
                  : parameters.filters || undefined,
          }
        : undefined;

    return (
        <EuiFlexGroup gutterSize="l" alignItems="stretch">
            <EuiFlexItem grow={2}>
                <EuiText>
                    <h1>{t('title')}</h1>
                </EuiText>

                <EuiSpacer size="m" />
                <EuiText size="s">
                    <h2>{tPage('filledParameters')}</h2>
                </EuiText>
                <EuiSpacer size="s" />
                {displayParameters && (
                    <FilterDisplay parameters={displayParameters} />
                )}

                <EuiSpacer size="m" />

                {results_data && results_data.action === 'view_results' && (
                    <>
                        <EuiText size="s">
                            <h2>
                                {tPage('results')} ({results_data.total_count})
                            </h2>
                        </EuiText>
                        <EuiSpacer size="s" />
                        {results_data.message && (
                            <>
                                <EuiText size="s">
                                    <p>{results_data.message}</p>
                                </EuiText>
                                <EuiSpacer size="s" />
                            </>
                        )}
                        <WfoSearchResults
                            results={results_data.results}
                            loading={false}
                            selectedRecordIndex={-1}
                            onRecordSelect={() => {}}
                        />
                    </>
                )}
            </EuiFlexItem>

            <EuiFlexItem grow={1}>
                <CopilotSidebar
                    defaultOpen
                    clickOutsideToClose={false}
                    labels={{
                        title: tPage('copilot.title'),
                        initial: tPage('copilot.initial'),
                    }}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
}
