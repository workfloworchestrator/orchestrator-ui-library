import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiCallOut,
    EuiFieldSearch,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiTab,
    EuiTabs,
    EuiText,
} from '@elastic/eui';

import { WfoSubscription } from '@/components';
import { WfoAvailabilityCheck } from '@/components/WfoAvailabilityCheck';
import { ENTITY_TABS } from '@/components/WfoSearchPage/utils';
import { TreeProvider } from '@/contexts';
import { useSearchAvailability } from '@/hooks/useBackendAvailability';
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
    const t = useTranslations('search.page');
    const searchAvailability = useSearchAvailability();

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

    const [filterGroup, setFilterGroup] = useState<Group>({
        op: 'AND',
        children: [],
    });

    const [showDetailPanel, setShowDetailPanel] = useState<boolean>(false);

    const debouncedQuery = useDebounce(query, DEFAULT_DEBOUNCE_DELAY);
    const { results, loading, setResults } = useSearch(
        debouncedQuery,
        selectedEntityTab,
        filterGroup,
        pageSize,
    );

    const [hasSearchBeenAttempted, setHasSearchBeenAttempted] = useState(false);

    useEffect(() => {
        const queryText =
            typeof debouncedQuery === 'string'
                ? debouncedQuery
                : debouncedQuery?.text?.trim() || '';
        const hasFilters = filterGroup && filterGroup.children.length > 0;

        if (queryText.length >= 2 || hasFilters) {
            setHasSearchBeenAttempted(true);
        } else if (queryText === '' || queryText === '*') {
            setHasSearchBeenAttempted(false);
        }
    }, [debouncedQuery, filterGroup]);

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

    const [searchValue, setSearchValue] = useState(() => {
        // For EuiSearchBar, we need to preserve the original query structure
        if (typeof query === 'string') {
            return query;
        }
        const queryText = query.text || '';
        return queryText;
    });

    const handleTabChange = (tabId: EntityKind) => {
        setSelectedEntityTab(tabId);
        setQuery('');
        setSearchValue('');
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

    const onSearchChange = (searchText: string) => {
        setSearchValue(searchText);
        setQuery(searchText);
    };

    useEffect(() => {
        if (typeof query === 'string') {
            if (query !== searchValue) {
                setSearchValue(query);
            }
        } else {
            const queryText = query.text || '';
            if (queryText !== searchValue) {
                setSearchValue(queryText);
            }
        }
    }, [query, searchValue]);

    const currentTab = ENTITY_TABS.find((tab) => tab.id === selectedEntityTab);

    const isSearchActive = results.data.length > 0 || loading;

    const shouldShowNoResults = (() => {
        // Only show no results banner if a search was actually attempted
        return hasSearchBeenAttempted && !loading && results.data.length === 0;
    })();

    useEffect(() => {
        if (results.data.length > 0) {
            if (selectedRecordId) {
                const foundIndex = results.data.findIndex(
                    (result) => result.entity_id === selectedRecordId,
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
    }, [results.data, selectedRecordId, urlParams]);

    useEffect(() => {
        setShowDetailPanel(
            results?.data?.length > 0 &&
                selectedRecordIndex >= 0 &&
                selectedEntityTab === 'SUBSCRIPTION',
        );
    }, [results?.data?.length, selectedRecordIndex, selectedEntityTab]);

    useEffect(() => {
        resetPagination();
    }, [debouncedQuery, selectedEntityTab, filterGroup, resetPagination]);

    const { RESULTS_GROW, DETAIL_GROW } = LAYOUT_RATIOS;

    return (
        <WfoAvailabilityCheck
            featureType="search"
            availability={searchAvailability}
        >
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

            <EuiFieldSearch
                placeholder={t('searchPlaceholder', {
                    entityType: currentTab?.label.toLowerCase(),
                })}
                value={searchValue || ''}
                onChange={(event) => {
                    onSearchChange(event.target.value);
                }}
                onSearch={(value) => {
                    onSearchChange(value);
                }}
                incremental={true}
                fullWidth
            />

            <EuiSpacer size="s" />

            <EuiFlexGroup gutterSize="s" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        iconType={showFilters ? 'eyeClosed' : 'eye'}
                        size="s"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? t('hideFilters') : t('showFilters')}
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>

            {showFilters && (
                <>
                    <EuiSpacer size="m" />
                    <EuiPanel hasBorder paddingSize="m">
                        <EuiText>
                            <h4>{t('structuredFilters')}</h4>
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
                        title={t('searchError')}
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
                            {t('dismiss')}
                        </EuiButton>
                    </EuiCallOut>
                    <EuiSpacer size="m" />
                </>
            )}

            {shouldShowNoResults && (
                <>
                    <EuiSpacer size="l" />
                    <EuiCallOut
                        title={t('noResults')}
                        color="primary"
                        iconType="search"
                        size="m"
                    >
                        <p>
                            {t('noResultsMessage', {
                                entityType: currentTab?.label.toLowerCase(),
                            })}
                        </p>
                        <EuiSpacer size="s" />
                        <EuiText size="s" color="subdued">
                            <p>{t('noResultsSuggestions')}</p>
                        </EuiText>
                    </EuiCallOut>
                    <EuiSpacer size="l" />
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
                                            setSelectedRecordId(
                                                record.entity_id,
                                            );
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
                                    {results.data[selectedRecordIndex] && (
                                        <TreeProvider>
                                            <WfoSubscription
                                                subscriptionId={
                                                    results.data[
                                                        selectedRecordIndex
                                                    ].entity_id
                                                }
                                            />
                                        </TreeProvider>
                                    )}
                                </EuiPanel>
                            </EuiFlexItem>
                        )}
                    </EuiFlexGroup>
                </>
            )}
        </WfoAvailabilityCheck>
    );
};
