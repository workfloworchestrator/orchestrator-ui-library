import { useCallback, useState } from 'react';

import { Query } from '@elastic/eui';

import { buildSearchParams } from '@/components/WfoSearchPage/utils';
import { useSearchWithPaginationMutation } from '@/rtk/endpoints';
import {
    AnySearchResult,
    EntityKind,
    Group,
    PaginatedSearchResults,
} from '@/types';


interface PageHistoryItem {
    page: number;
    results: AnySearchResult[];
    cursor: number | null;
}

interface UseSearchPaginationReturn {
    currentPage: number;
    pageHistory: PageHistoryItem[];
    error: string | null;
    isLoadingMore: boolean;
    handleNextPage: (nextPageCursor: number) => Promise<void>;
    handlePrevPage: () => void;
    resetPagination: () => void;
    setError: (error: string | null) => void;
}

export const useSearchPagination = (
    debouncedQuery: Query | string,
    selectedEntityTab: EntityKind,
    filterGroup: Group,
    pageSize: number,
    results: PaginatedSearchResults,
    setResults: (results: PaginatedSearchResults) => void,
): UseSearchPaginationReturn => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageHistory, setPageHistory] = useState<PageHistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const [triggerSearchPagination] = useSearchWithPaginationMutation();

    const handleNextPage = useCallback(
        async (nextPageCursor: number) => {
            if (!nextPageCursor || isLoadingMore) return;
            
            setIsLoadingMore(true);

            setPageHistory((prev) => [
                ...prev.filter((p) => p.page !== currentPage),
                {
                    page: currentPage,
                    results: results.data,
                    cursor: results.page_info.next_page_cursor,
                },
            ]);

            try {
                setError(null);
                const searchParams = buildSearchParams(
                    debouncedQuery,
                    selectedEntityTab,
                    filterGroup,
                    pageSize,
                );

                const res = await triggerSearchPagination({
                    ...searchParams,
                    cursor: nextPageCursor,
                }).unwrap();

                setResults({
                    data: res.data || [],
                    page_info: {
                        has_next_page: res.page_info.has_next_page,
                        next_page_cursor: res.page_info.next_page_cursor,
                    },
                    search_metadata: {
                        search_type: res.search_metadata.search_type,
                        description: res.search_metadata.description,
                    },
                });

                setCurrentPage((prev) => prev + 1);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred while loading the next page';
                setError(errorMessage);
                console.error('Load next page error:', error);
            } finally {
                setIsLoadingMore(false);
            }
        },
        [
            currentPage,
            results.data,
            results.page_info.next_page_cursor,
            isLoadingMore,
            debouncedQuery,
            selectedEntityTab,
            filterGroup,
            pageSize,
            setResults,
            triggerSearchPagination,
        ],
    );

    const handlePrevPage = useCallback(() => {
        const previousPage = pageHistory.find(
            (p) => p.page === currentPage - 1,
        );
        if (previousPage) {
            setResults({
                data: previousPage.results,
                page_info: {
                    has_next_page: true,
                    next_page_cursor: previousPage.cursor,
                },
                search_metadata: results.search_metadata,
            });

            setCurrentPage((prev) => prev - 1);

            setPageHistory((prev) => prev.filter((p) => p.page < currentPage));
        }
    }, [currentPage, pageHistory, results.search_metadata, setResults]);

    const resetPagination = useCallback(() => {
        setCurrentPage(1);
        setPageHistory([]);
    }, []);

    return {
        currentPage,
        pageHistory,
        error,
        isLoadingMore,
        handleNextPage,
        handlePrevPage,
        resetPagination,
        setError,
    };
};
