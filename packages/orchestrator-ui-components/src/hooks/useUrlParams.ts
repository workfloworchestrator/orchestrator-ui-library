import { useCallback, useEffect, useState } from 'react';

import { Query } from '@elastic/eui';

import { EntityKind } from '@/types';

import { DEFAULT_ENTITY_TAB, VALID_ENTITY_TYPES } from '../components/WfoSearchPage/constants';

interface UseUrlParamsReturn {
  urlParams: URLSearchParams;
  query: Query | string;
  selectedEntityTab: EntityKind;
  showFilters: boolean;
  selectedRecordIndex: number;
  selectedRecordId: string | null;
  setQuery: (query: Query | string) => void;
  setSelectedEntityTab: (tab: EntityKind) => void;
  setShowFilters: (show: boolean) => void;
  setSelectedRecordIndex: (index: number) => void;
  setSelectedRecordId: (id: string | null) => void;
}

export const useUrlParams = (): UseUrlParamsReturn => {
  const [urlParams, setUrlParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  const [query, setQuery] = useState<Query | string>(() => {
    const queryParam = urlParams.get('q');
    return queryParam || '';
  });

  const [selectedEntityTab, setSelectedEntityTab] = useState<EntityKind>(() => {
    const tabParam = urlParams.get('tab') as EntityKind;
    return tabParam && VALID_ENTITY_TYPES.includes(tabParam) ? tabParam : DEFAULT_ENTITY_TAB;
  });

  const [showFilters, setShowFilters] = useState<boolean>(() => {
    return urlParams.get('filters') === 'true';
  });

  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number>(() => {
    const indexParam = urlParams.get('selected');
    return indexParam ? parseInt(indexParam, 10) || 0 : 0;
  });

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(() => {
    return urlParams.get('id') || null;
  });

  const updateUrl = useCallback(() => {
    const newParams = new URLSearchParams();

    const queryText = typeof query === 'string' ? query : query.text || '';
    if (queryText && queryText !== '*') {
      newParams.set('q', queryText);
    }

    if (selectedEntityTab !== DEFAULT_ENTITY_TAB) {
      newParams.set('tab', selectedEntityTab);
    }

    if (showFilters) {
      newParams.set('filters', 'true');
    }

    if (selectedRecordIndex > 0) {
      newParams.set('selected', selectedRecordIndex.toString());
    }

    if (selectedRecordId) {
      newParams.set('id', selectedRecordId);
    }

    const newUrl =
      newParams.toString() ? `${window.location.pathname}?${newParams.toString()}` : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
    setUrlParams(newParams);
  }, [query, selectedEntityTab, showFilters, selectedRecordIndex, selectedRecordId]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  return {
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
  };
};
