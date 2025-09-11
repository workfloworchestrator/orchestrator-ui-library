import React from 'react';

import {
    EuiBadge,
    EuiButton,
    EuiCallOut,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSearchBar,
    EuiSearchBarOnChangeArgs,
    EuiSpacer,
    EuiTab,
    EuiTabs,
    EuiText,
} from '@elastic/eui';

import { WfoSubscription } from '@/components';
import {
    ENTITY_TABS,
    findResultIndexById,
    getRecordId,
    isSubscriptionSearchResult,
} from '@/components/WfoSearchPage/utils';
import { TreeProvider } from '@/contexts';
import { useOrchestratorTheme } from '@/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useSearch';
import { useSearchPagination } from '@/hooks/useSearchPagination';
import { useUrlParams } from '@/hooks/useUrlParams';
import { EntityKind, Group } from '@/types';

import { FilterGroup } from '../WfoFilterGroup';
import { WfoSearchResults } from '../WfoSearchResults';
import { WfoSearchMetadataHeader } from '../WfoSearchResults/WfoSearchMetadataHeader';
import { WfoSearchPaginationInfo } from '../WfoSearchResults/WfoSearchPaginationInfo';
import {
    DEFAULT_DEBOUNCE_DELAY,
    DEFAULT_PAGE_SIZE,
    LAYOUT_RATIOS,
    SMALL_RESULT_THRESHOLD,
} from '../constants';

export const WfoSearch = () => {
    const { theme } = useOrchestratorTheme();
    const {
        urlParams,
        query,
        selectedEntityTab,
        showFilters,
        selectedRecordIndex,
        selectedRecordId,
        setQuery,
        setSelectedEntityTab,
        setShowFilters,
        setSelectedRecordIndex,
        setSelectedRecordId,
    } = useUrlParams();

    const pageSize = DEFAULT_PAGE_SIZE;

    const [filterGroup, setFilterGroup] = React.useState<Group>({
        op: 'AND',
        children: [],
    });

    const [showDetailPanel, setShowDetailPanel] =
        React.useState<boolean>(false);

    const debouncedQuery = useDebounce(query, DEFAULT_DEBOUNCE_DELAY);
    const { results, loading, setResults } = useSearch(
        debouncedQuery,
        selectedEntityTab,
        filterGroup,
        pageSize,
    );

    const {
        currentPage,
        error,
        isLoadingMore,
        handleNextPage,
        handlePrevPage,
        resetPagination,
        setError,
    } = useSearchPagination(
        debouncedQuery,
        selectedEntityTab,
        filterGroup,
        pageSize,
        results,
        setResults,
    );

    const handleTabChange = (tabId: EntityKind) => {
        setSelectedEntityTab(tabId);
        setQuery(EuiSearchBar.Query.MATCH_ALL);
        setFilterGroup({
            op: 'AND',
            children: [],
        });
        setResults({
            data: [],
            page_info: {
                has_next_page: false,
                next_page_cursor: null,
            },
            search_metadata: {
                search_type: null,
                description: null,
            },
        });
        setSelectedRecordIndex(0);
        setShowDetailPanel(false);
        resetPagination();
    };

    const onSearchChange = ({ query }: EuiSearchBarOnChangeArgs) => {
        setQuery(query || EuiSearchBar.Query.MATCH_ALL);
        return true;
    };

    const currentTab = ENTITY_TABS.find((tab) => tab.id === selectedEntityTab);

    const isSearchActive = results.data.length > 0 || loading;

    React.useEffect(() => {
        if (results.data.length > 0) {
            if (selectedRecordId) {
                const foundIndex = findResultIndexById(
                    results.data,
                    selectedRecordId,
                );

                if (foundIndex !== -1) {
                    setSelectedRecordIndex(foundIndex);
                } else if (results.data.length <= SMALL_RESULT_THRESHOLD) {
                    setSelectedRecordIndex(0);
                    setSelectedRecordId(null);
                }
            } else if (results.data.length <= SMALL_RESULT_THRESHOLD) {
                const indexFromUrl = urlParams.get('selected');
                if (!indexFromUrl) {
                    setSelectedRecordIndex(0);
                }
            }
        }
    }, [
        results.data,
        selectedRecordId,
        urlParams,
        setSelectedRecordId,
        setSelectedRecordIndex,
    ]);

    React.useEffect(() => {
        setShowDetailPanel(
            results?.data?.length > 0 && selectedRecordIndex >= 0,
        );
    }, [results?.data?.length, selectedRecordIndex]);

    React.useEffect(() => {
        resetPagination();
    }, [debouncedQuery, selectedEntityTab, filterGroup, resetPagination]);

    const { RESULTS_GROW, DETAIL_GROW } = LAYOUT_RATIOS;

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

            {error && (
                <>
                    <EuiCallOut
                        title="Error"
                        color="danger"
                        iconType="alert"
                        size="s"
                    >
                        <p>{error}</p>
                        <EuiButton
                            size="s"
                            color="danger"
                            onClick={() => setError(null)}
                        >
                            Dismiss
                        </EuiButton>
                    </EuiCallOut>
                    <EuiSpacer size="m" />
                </>
            )}

            {isSearchActive && (
                <>
                    <EuiSpacer size="m" />

                    <EuiFlexGroup gutterSize="s" alignItems="center">
                        <EuiFlexItem grow={showDetailPanel ? RESULTS_GROW : 1}>
                            <EuiFlexGroup
                                gutterSize="s"
                                alignItems="center"
                                justifyContent="spaceBetween"
                                responsive={false}
                                style={{ width: '100%' }}
                            >
                                <EuiFlexItem grow={false}>
                                    <WfoSearchMetadataHeader
                                        search_metadata={
                                            results.search_metadata
                                        }
                                    />
                                </EuiFlexItem>

                                <EuiFlexItem grow={false}>
                                    <WfoSearchPaginationInfo
                                        has_next_page={
                                            results.page_info.has_next_page
                                        }
                                        next_page_cursor={
                                            results.page_info.next_page_cursor
                                        }
                                        onNextPage={handleNextPage}
                                        onPrevPage={handlePrevPage}
                                        isLoading={isLoadingMore}
                                        currentPage={currentPage}
                                        hasPrevPage={currentPage > 1}
                                        resultCount={results?.data?.length || 0}
                                    />
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiFlexItem>

                        {showDetailPanel && <EuiFlexItem grow={DETAIL_GROW} />}
                    </EuiFlexGroup>

                    <EuiSpacer size="s" />

                    <EuiFlexGroup gutterSize="s" alignItems="flexStart">
                        <EuiFlexItem grow={showDetailPanel ? RESULTS_GROW : 1}>
                            <EuiPanel paddingSize="none" hasBorder={true}>
                                <WfoSearchResults
                                    results={results.data}
                                    loading={loading}
                                    selectedRecordIndex={selectedRecordIndex}
                                    onRecordSelect={(index: number) => {
                                        setSelectedRecordIndex(index);
                                        const record = results.data[index];
                                        if (record) {
                                            const recordId =
                                                getRecordId(record);
                                            setSelectedRecordId(recordId);
                                        }
                                    }}
                                />
                            </EuiPanel>
                        </EuiFlexItem>

                        {showDetailPanel && (
                            <EuiFlexItem grow={DETAIL_GROW}>
                                <EuiPanel
                                    paddingSize="m"
                                    hasBorder={true}
                                    hasShadow={false}
                                    color="transparent"
                                >
                                    {selectedEntityTab === 'SUBSCRIPTION' &&
                                    results.data[selectedRecordIndex] &&
                                    isSubscriptionSearchResult(
                                        results.data[selectedRecordIndex],
                                    ) ? (
                                        <TreeProvider>
                                            <WfoSubscription
                                                subscriptionId={
                                                    results.data[
                                                        selectedRecordIndex
                                                    ].subscription
                                                        .subscription_id
                                                }
                                            />
                                        </TreeProvider>
                                    ) : (
                                        <>
                                            <EuiText>
                                                <h4>Details</h4>
                                            </EuiText>
                                            <EuiSpacer size="m" />
                                            <EuiText
                                                color={theme.colors.textSubdued}
                                            >
                                                <p>
                                                    Showing details for result #
                                                    {selectedRecordIndex + 1}
                                                </p>
                                                <EuiSpacer size="s" />
                                                <EuiBadge
                                                    color={theme.colors.primary}
                                                >
                                                    {selectedEntityTab} #
                                                    {selectedRecordIndex + 1}
                                                </EuiBadge>
                                                <EuiSpacer size="m" />
                                                <p>
                                                    <em>
                                                        Detail content will be
                                                        implemented here...
                                                    </em>
                                                </p>
                                            </EuiText>
                                        </>
                                    )}
                                </EuiPanel>
                            </EuiFlexItem>
                        )}
                    </EuiFlexGroup>
                </>
            )}
        </>
    );
};
