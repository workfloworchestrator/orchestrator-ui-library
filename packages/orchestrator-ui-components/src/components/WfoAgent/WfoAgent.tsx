import React from 'react';

import { useCoAgent } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { ColumnType, WfoTable, type WfoTableColumnConfig } from '@/components';
import {
    isProcessSearchResult,
    isProductSearchResult,
    isSubscriptionSearchResult,
    isWorkflowSearchResult,
} from '@/components/WfoSearchPage/utils';
import {
    AnySearchParameters,
    AnySearchResult,
    EntityKind,
    PathFilter,
} from '@/types';

import { FilterDisplay } from './FilterDisplay';

type Row = Record<string, unknown>;

function startCase(key: string) {
    return key
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/^./, (c) => c.toUpperCase());
}

function buildColumnConfig(rows: Row[]): WfoTableColumnConfig<Row> {
    const first = rows[0] ?? {};
    return Object.keys(first).reduce((cfg, key) => {
        cfg[key] = { columnType: ColumnType.DATA, label: startCase(key) };
        return cfg;
    }, {} as WfoTableColumnConfig<Row>);
}

function mapRows(entityType: EntityKind, results: AnySearchResult[]): Row[] {
    switch (entityType) {
        case 'SUBSCRIPTION':
            return results.filter(isSubscriptionSearchResult).map((r) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sub = r.subscription as any;
                return {
                    subscriptionId: sub?.subscription_id ?? '—',
                    description: sub?.description ?? null,
                    status: sub?.status ?? null,
                    customerId: sub?.customer_id ?? null,
                    productId: sub?.product_id ?? null,
                    score:
                        typeof r.score === 'number' ? r.score.toFixed(4) : null,
                };
            });
        case 'PROCESS':
            return results.filter(isProcessSearchResult).map((r) => ({
                processId: r.processId,
                workflowName: r.workflowName,
                status: r.status ?? null,
                isTask: r.isTask ? 'Yes' : 'No',
                startedAt: r.startedAt ?? null,
                lastModifiedAt: r.lastModifiedAt ?? null,
            }));
        case 'PRODUCT':
            return results.filter(isProductSearchResult).map((r) => ({
                productId: r.productId,
                name: r.name,
                productType: r.productType ?? null,
                status: r.status ?? null,
                tag: r.tag ?? null,
                createdAt: r.createdAt ?? null,
            }));
        case 'WORKFLOW':
            return results.filter(isWorkflowSearchResult).map((r) => ({
                name: r.name,
                description: r.description ?? null,
                productsCount: Array.isArray(r.products)
                    ? r.products.length
                    : 0,
                createdAt: r.createdAt ?? null,
            }));
        default:
            return [];
    }
}

export function AgentResultsTableSimple({
    entityType,
    results,
}: {
    entityType?: EntityKind;
    results: AnySearchResult[];
}) {
    if (!entityType || results.length === 0) {
        return (
            <EuiPanel hasBorder paddingSize="m">
                <EuiText color="subdued">
                    <em>No results to display.</em>
                </EuiText>
            </EuiPanel>
        );
    }

    const rows = mapRows(entityType, results);
    if (rows.length === 0) {
        return (
            <EuiPanel hasBorder paddingSize="m">
                <EuiText color="subdued">
                    <em>No results to display.</em>
                </EuiText>
            </EuiPanel>
        );
    }

    const columnConfig = buildColumnConfig(rows);
    return <WfoTable<Row> data={rows} columnConfig={columnConfig} />;
}

type SearchState = {
    parameters: AnySearchParameters;
    results: AnySearchResult[];
};

const initialState: SearchState = {
    parameters: {
        action: 'select',
        entity_type: 'SUBSCRIPTION',
        filters: [] as PathFilter[],
        query: null,
    },
    results: [],
};

export function WfoAgent() {
    const { state } = useCoAgent<SearchState>({
        name: 'query_agent',
        initialState,
    });
    const { parameters, results } = state;

    const hasStarted =
        !!state.parameters &&
        Array.isArray(state.parameters.filters) &&
        state.parameters.filters.length > 0;
    const isLoadingResults =
        hasStarted && (!state.results || state.results.length === 0);

    const displayParameters = parameters
        ? {
              ...parameters,
              filters: Array.isArray(parameters.filters)
                  ? { op: 'AND' as const, children: parameters.filters }
                  : parameters.filters,
          }
        : parameters;

    return (
        <EuiFlexGroup gutterSize="l" alignItems="stretch">
            <EuiFlexItem grow={2}>
                <EuiText>
                    <h1>Search results</h1>
                </EuiText>

                <EuiSpacer size="m" />
                <EuiText size="s">
                    <h2>Filled parameters</h2>
                </EuiText>
                <EuiSpacer size="s" />
                {displayParameters && (
                    <FilterDisplay parameters={displayParameters} />
                )}

                <EuiSpacer size="m" />
                <EuiText size="s">
                    <h2>Results {results ? `(${results.length})` : ''}</h2>
                </EuiText>
                <EuiSpacer size="s" />

                {isLoadingResults ? (
                    <EuiText color="subdued">Searching database…</EuiText>
                ) : (
                    <AgentResultsTableSimple
                        entityType={
                            parameters?.entity_type as EntityKind | undefined
                        }
                        results={results ?? []}
                    />
                )}
            </EuiFlexItem>

            <EuiFlexItem grow={1}>
                <CopilotSidebar
                    defaultOpen
                    clickOutsideToClose={false}
                    labels={{
                        title: 'Database assistant',
                        initial:
                            'sk me things such as:\n' +
                            '• *Find active subscriptions for Surf*\n' +
                            '• *Show workflows containing “billing”*\n\n' +
                            'The filled template and results will appear on the left.',
                    }}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
}
