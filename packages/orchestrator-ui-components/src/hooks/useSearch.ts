import { useContext, useEffect, useState } from 'react';

import { Query } from '@elastic/eui';

import { getEndpointPath } from '@/components/WfoSearchPage/utils';
import { OrchestratorConfigContext } from '@/contexts/OrchestratorConfigContext';
import { EntityKind, Group, PaginatedSearchResults } from '@/types';

export const useSearch = (
    query: Query | string,
    entityType: EntityKind,
    filterGroup?: Group,
    limit?: number,
) => {
    const [results, setResults] = useState<PaginatedSearchResults>({
        data: [],
        page_info: { has_next_page: false, next_page_cursor: null },
        search_metadata: { search_type: null, description: null },
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);

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
            setError(null);
            return;
        }

        const performSearch = async () => {
            setLoading(true);
            setError(null);

            try {
                const endpoint = `${orchestratorApiBaseUrl}/search/${getEndpointPath(entityType)}`;
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'select',
                        entity_type: entityType,
                        query: queryText,
                        filters:
                            filterGroup && filterGroup.children.length > 0
                                ? filterGroup
                                : undefined,
                        limit: limit,
                    }),
                });

                if (!response.ok) {
                    setError('Search failed');
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
                    return;
                }

                const res = await response.json();
                setResults({
                    data: res.data || [],
                    page_info: {
                        has_next_page: res.page_info?.has_next_page || false,
                        next_page_cursor:
                            res.page_info?.next_page_cursor || null,
                    },
                    search_metadata: {
                        search_type: res.search_metadata?.search_type || null,
                        description: res.search_metadata?.description || null,
                    },
                });
            } catch (error) {
                console.error('Search error:', error);
                setError('Network error');
                setResults({
                    data: [],
                    page_info: { has_next_page: false, next_page_cursor: null },
                    search_metadata: { search_type: null, description: null },
                });
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query, entityType, filterGroup, limit, orchestratorApiBaseUrl]);

    return { results, loading, error, setResults };
};
