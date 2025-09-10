import { useCoAgent } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import { WfoSearchResults } from '@/components/WfoSearchPage/WfoSearchResults';
import { AnySearchParameters, AnySearchResult, PathFilter } from '@/types';

import { FilterDisplay } from '../FilterDisplay';

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

    const hasStarted = !!(
        state.parameters &&
        Array.isArray(state.parameters.filters) &&
        state.parameters.filters.length > 0
    );
    
    const isLoadingResults = hasStarted && (!state.results || state.results.length === 0);

    const displayParameters = parameters && {
        ...parameters,
        filters: Array.isArray(parameters.filters)
            ? { op: 'AND' as const, children: parameters.filters }
            : parameters.filters,
    };

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

                <WfoSearchResults
                    results={results ?? []}
                    loading={isLoadingResults}
                    selectedRecordIndex={-1}
                    onRecordSelect={() => {}}
                />
            </EuiFlexItem>

            <EuiFlexItem grow={1}>
                <CopilotSidebar
                    defaultOpen
                    clickOutsideToClose={false}
                    labels={{
                        title: 'Database assistant',
                        initial:
                            'Ask me things such as:\n' +
                            '• *Find active subscriptions for Surf*\n' +
                            '• *Show terminated workflows”*\n\n' +
                            'The filled template and results will appear on the left.',
                    }}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
}
