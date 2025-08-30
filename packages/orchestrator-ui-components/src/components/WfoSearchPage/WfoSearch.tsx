import React, { useCallback, useState } from 'react';

import {
    EuiBadge,
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSearchBar,
    EuiSearchBarOnChangeArgs,
    EuiSpacer,
    EuiTab,
    EuiTabs,
    EuiText,
    Query,
} from '@elastic/eui';

import { WfoSearchResults } from '@/components/WfoSearchPage/WfoSearchResults';
import {
    ENTITY_TABS,
    getEndpointPath,
    isCondition,
} from '@/components/WfoSearchPage/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useSearch';
import { AnySearchParameters, AnySearchResult, EntityKind } from '@/types';
import { Group } from '@/types';

import { FilterGroup } from './FilterGroup';

export const WfoSearch = () => {
    const [query, setQuery] = useState<Query | string>(
        EuiSearchBar.Query.MATCH_ALL,
    );
    const [selectedEntityTab, setSelectedEntityTab] =
        useState<EntityKind>('SUBSCRIPTION');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [filterGroup, setFilterGroup] = useState<Group>({
        op: 'AND',
        children: [],
    });
    const [manualResults, setManualResults] = useState<AnySearchResult[]>([]);
    const [manualLoading, setManualLoading] = useState<boolean>(false);

    const debouncedQuery = useDebounce(query, 300);
    const { results: autoResults, loading: autoLoading } = useSearch(
        debouncedQuery,
        selectedEntityTab,
    );

    const handleTabChange = (tabId: EntityKind) => {
        setSelectedEntityTab(tabId);
        setQuery(EuiSearchBar.Query.MATCH_ALL);
        setFilterGroup({
            op: 'AND',
            children: [],
        });
        setManualResults([]);
    };

    const onSearchChange = ({ query }: EuiSearchBarOnChangeArgs) => {
        setQuery(query || EuiSearchBar.Query.MATCH_ALL);
        return true;
    };

    const handleManualSearch = useCallback(async () => {
        setManualLoading(true);
        try {
            let queryText = '';
            if (typeof query === 'string') {
                queryText = query;
            } else if (query && query.text) {
                queryText = query.text.trim();
            }

            const searchParams: AnySearchParameters = {
                action: 'select',
                entity_type: selectedEntityTab,
                query: queryText || undefined,
                filters:
                    filterGroup.children.length > 0 ? filterGroup : undefined,
            } as AnySearchParameters;

            const endpointPath = getEndpointPath(selectedEntityTab);
            const endpoint = `http://127.0.0.1:8080/api/search/${endpointPath}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchParams),
            });

            if (!response.ok) {
                throw new Error(
                    `Search failed with status: ${response.status}`,
                );
            }

            const data = await response.json();
            setManualResults(data.page || []);
        } catch (error) {
            console.error('Manual search error:', error);
            setManualResults([]);
        } finally {
            setManualLoading(false);
        }
    }, [query, filterGroup, selectedEntityTab]);

    const isFilterValid = (group: Group): boolean => {
        return group.children.every((child) => {
            if (isCondition(child)) {
                return (
                    child.path &&
                    child.condition.op &&
                    (child.condition.value !== undefined ||
                        ['is_null', 'is_not_null'].includes(child.condition.op))
                );
            }
            return isFilterValid(child);
        });
    };

    const currentTab = ENTITY_TABS.find((tab) => tab.id === selectedEntityTab);
    const hasConditions = filterGroup.children.length > 0;
    const filterValid = isFilterValid(filterGroup);

    const hasManualResults = manualResults.length > 0 || manualLoading;
    const hasFilters = hasConditions && showFilters;

    const showManualResults = hasFilters || hasManualResults;
    const activeResults = showManualResults ? manualResults : autoResults;
    const activeLoading = showManualResults ? manualLoading : autoLoading;
    const isSearchActive = activeResults.length > 0 || activeLoading;

    return (
        <>
            <EuiTabs>
                {ENTITY_TABS.map((tab) => (
                    <EuiTab
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        isSelected={selectedEntityTab === tab.id}
                    >
                        {tab.label}
                    </EuiTab>
                ))}
            </EuiTabs>
            <EuiSpacer size="m" />

            <EuiSearchBar
                box={{
                    placeholder: `Search for ${currentTab?.label.toLowerCase()}…`,
                    incremental: true,
                }}
                query={query}
                onChange={onSearchChange}
            />

            <EuiSpacer size="s" />

            <EuiFlexGroup gutterSize="s" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        iconType={showFilters ? 'eyeClosed' : 'eye'}
                        size="s"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>

            {showFilters && (
                <>
                    <EuiSpacer size="m" />
                    <EuiPanel hasBorder paddingSize="m">
                        <EuiText>
                            <h4>Structured Filters</h4>
                        </EuiText>
                        <EuiSpacer size="s" />
                        <FilterGroup
                            group={filterGroup}
                            entityType={selectedEntityTab}
                            onChange={setFilterGroup}
                            isRoot
                        />
                    </EuiPanel>
                </>
            )}

            <EuiSpacer size="m" />

            <EuiFlexGroup gutterSize="s">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        fill
                        iconType="search"
                        onClick={handleManualSearch}
                        isLoading={manualLoading}
                        disabled={showFilters && hasConditions && !filterValid}
                    >
                        Search
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>

            {isSearchActive && (
                <>
                    <EuiSpacer size="m" />
                    <EuiFlexGroup gutterSize="s" alignItems="center">
                        <EuiFlexItem>
                            <EuiText size="xs" color="subdued">
                                {showManualResults
                                    ? 'Manual search results'
                                    : 'Live search results'}
                            </EuiText>
                        </EuiFlexItem>
                        {activeResults.length > 0 && (
                            <EuiFlexItem grow={false}>
                                <EuiBadge color="hollow">
                                    {activeResults.length} result
                                    {activeResults.length !== 1 ? 's' : ''}
                                </EuiBadge>
                            </EuiFlexItem>
                        )}
                    </EuiFlexGroup>
                    <EuiSpacer size="s" />
                    <EuiPanel paddingSize="none" hasBorder={true}>
                        <WfoSearchResults
                            results={activeResults}
                            loading={activeLoading}
                        />
                    </EuiPanel>
                </>
            )}
        </>
    );
};
