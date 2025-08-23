import { useContext, useEffect, useState } from 'react';

import { OrchestratorConfigContext } from '@/contexts/OrchestratorConfigContext';
import { EntityKind, PathAutocompleteResponse, PathInfo } from '@/types';

import { useDebounce } from './useDebounce';

export const usePathAutocomplete = (prefix: string, entityType: EntityKind) => {
    const [paths, setPaths] = useState<PathInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [definitions, setDefinitions] = useState<Record<string, any>>({});
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);

    const debouncedPrefix = useDebounce(prefix, 300);

    useEffect(() => {
        if (Object.keys(definitions).length === 0) {
            fetch(`${orchestratorApiBaseUrl}/search/definitions`)
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error(
                            `HTTP ${res.status}: ${res.statusText}`,
                        );
                    }
                    return res.json();
                })
                .then((data) => {
                    setDefinitions(data);
                })
                .catch((err) => {
                    console.error('Failed to load definitions:', err);
                    // Fallback
                    setDefinitions({
                        string: {
                            operators: ['eq', 'neq'],
                            valueSchema: {
                                eq: { kind: 'string' },
                                neq: { kind: 'string' },
                            },
                        },
                        number: {
                            operators: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'],
                            valueSchema: {
                                eq: { kind: 'number' },
                                neq: { kind: 'number' },
                                lt: { kind: 'number' },
                                lte: { kind: 'number' },
                                gt: { kind: 'number' },
                                gte: { kind: 'number' },
                            },
                        },
                        boolean: {
                            operators: ['eq', 'neq'],
                            valueSchema: {
                                eq: { kind: 'boolean' },
                                neq: { kind: 'boolean' },
                            },
                        },
                        datetime: {
                            operators: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'],
                            valueSchema: {
                                eq: { kind: 'datetime' },
                                neq: { kind: 'datetime' },
                                lt: { kind: 'datetime' },
                                lte: { kind: 'datetime' },
                                gt: { kind: 'datetime' },
                                gte: { kind: 'datetime' },
                            },
                        },
                    });
                });
        }
    }, [definitions, orchestratorApiBaseUrl]);

    useEffect(() => {
        if (debouncedPrefix.length < 1) {
            setError(null);
            return;
        }

        const fetchPaths = async () => {
            setLoading(true);
            setError(null);

            try {
                const url = `${orchestratorApiBaseUrl}/search/paths?prefix=${encodeURIComponent(debouncedPrefix)}&entity_type=${entityType}`;
                const response = await fetch(url);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage =
                        errorData.message ||
                        (response.status === 422
                            ? 'Invalid search input'
                            : response.status >= 500
                              ? 'Server error - try again'
                              : `Error ${response.status}`);
                    setError(errorMessage);
                    setPaths([]);
                    return;
                }

                const data: PathAutocompleteResponse = await response.json();

                const enrichedPaths = (data.paths || []).map((path) => {
                    const typeDefinition = definitions[path.type];

                    return {
                        ...path,
                        operators: typeDefinition?.operators || [],
                        valueSchema: typeDefinition?.valueSchema || {},
                    };
                });

                setPaths(enrichedPaths);
            } catch (error) {
                if (
                    error instanceof TypeError &&
                    error.message.includes('fetch')
                ) {
                    setError('Network error - please check your connection');
                    setPaths([]);
                } else {
                    throw error;
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPaths();
    }, [debouncedPrefix, entityType, definitions, orchestratorApiBaseUrl]);

    return { paths, loading, error };
};
