import { useEffect, useState } from 'react';

import { Query } from '@elastic/eui';

import { useSearchMutation } from '@/rtk/endpoints';
import {
    EntityKind,
    Group,
    PaginatedSearchResults,
    RetrieverType,
} from '@/types';

export const useSearch = (
    query: Query | string,
    entityType: EntityKind,
    filterGroup?: Group,
    limit?: number,
    retriever: RetrieverType = RetrieverType.Auto,
) => {
    const [results, setResults] = useState<PaginatedSearchResults>({
        data: [],
        page_info: { has_next_page: false, next_page_cursor: null },
        search_metadata: { search_type: null, description: null },
    });

    const [triggerSearch, { isLoading, isError }] = useSearchMutation();

    useEffect(() => {
        const queryText =
            typeof query === 'string' ? query : query.text?.trim() || '';

        const hasFilters = filterGroup && filterGroup.children.length > 0;

        if (queryText.length < 2 && !hasFilters) {
            setResults({
                data: [],
                page_info: { has_next_page: false, next_page_cursor: null },
                search_metadata: { search_type: null, description: null },
            });
            return;
        }

        const performSearch = async () => {
            try {
                const result = await triggerSearch({
                    entity_type: entityType,
                    query: queryText,
                    filters:
                        filterGroup && filterGroup.children.length > 0
                            ? filterGroup
                            : undefined,
                    limit: limit,
                    retriever:
                        retriever === RetrieverType.Auto
                            ? undefined
                            : retriever,
                }).unwrap();

                setResults({
                    data: result.data || [],
                    page_info: {
                        has_next_page: result.page_info?.has_next_page || false,
                        next_page_cursor:
                            result.page_info?.next_page_cursor || null,
                    },
                    search_metadata: {
                        search_type:
                            result.search_metadata?.search_type || null,
                        description:
                            result.search_metadata?.description || null,
                    },
                });
            } catch (error) {
                console.error('Search error:', error);
                setResults({
                    data: [],
                    page_info: { has_next_page: false, next_page_cursor: null },
                    search_metadata: { search_type: null, description: null },
                });
            }
        };

        performSearch();
    }, [query, entityType, filterGroup, limit, retriever, triggerSearch]);

    return {
        results,
        loading: isLoading,
        error: isError ? 'Search failed' : null,
        setResults,
    };
};
