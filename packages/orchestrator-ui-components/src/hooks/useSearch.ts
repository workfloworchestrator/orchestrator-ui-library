import { useContext, useEffect, useState } from 'react';

import { Query } from '@elastic/eui';

import { getEndpointPath } from '@/components/WfoSearchPage/utils';
import { OrchestratorConfigContext } from '@/contexts/OrchestratorConfigContext';
import { AnySearchResult, EntityKind } from '@/types';

export const useSearch = (query: Query | string, entityType: EntityKind) => {
    const [results, setResults] = useState<AnySearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);

    useEffect(() => {
        const queryText =
            typeof query === 'string' ? query : query.text?.trim() || '';

        if (queryText.length < 2) {
            setResults([]);
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
                    }),
                });

                if (!response.ok) {
                    setError('Search failed');
                    setResults([]);
                    return;
                }

                const data = await response.json();
                setResults(data.page || []);
            } catch {
                setError('Network error');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query, entityType, orchestratorApiBaseUrl]);

    return { results, loading, error };
};
