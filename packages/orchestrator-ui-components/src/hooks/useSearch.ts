import { useEffect, useState } from 'react';

import { Query } from '@elastic/eui';

import { useSearchMutation } from '@/rtk/endpoints';
import { EntityKind, Filter, PaginatedSearchResults, RetrieverType } from '@/types';

const emptyResult: PaginatedSearchResults = {
  data: [],
  page_info: { has_next_page: false, next_page_cursor: null },
  search_metadata: { search_type: null, description: null },
  cursor: {
    total_items: 0,
    start_cursor: 0,
    end_cursor: 0,
  },
};

export const useSearch = (
  query: Query | string,
  entityType: EntityKind,
  filterGroup?: Filter,
  limit?: number,
  retriever: RetrieverType = RetrieverType.Auto,
) => {
  const [results, setResults] = useState<PaginatedSearchResults>({ ...emptyResult });

  const [triggerSearch, { isLoading, isError }] = useSearchMutation();

  useEffect(() => {
    const queryText = typeof query === 'string' ? query : query.text?.trim() || '';

    const hasFilters = filterGroup && filterGroup.children.length > 0;

    if (queryText.length < 2 && !hasFilters) {
      setResults({
        ...emptyResult,
      });
      return;
    }

    const performSearch = async () => {
      try {
        const result = await triggerSearch({
          entity_type: entityType,
          query: queryText,
          filters: filterGroup && filterGroup.children.length > 0 ? filterGroup : undefined,
          limit: limit,
          retriever: retriever === RetrieverType.Auto ? undefined : retriever,
          response_columns: [],
        }).unwrap();

        setResults({
          data: result.data || [],
          page_info: {
            has_next_page: result.page_info?.has_next_page || false,
            next_page_cursor: result.page_info?.next_page_cursor || null,
          },
          search_metadata: {
            search_type: result.search_metadata?.search_type || null,
            description: result.search_metadata?.description || null,
          },
          cursor: result.cursor,
        });
      } catch (error) {
        console.error('Search error:', error);
        setResults({
          ...emptyResult,
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
