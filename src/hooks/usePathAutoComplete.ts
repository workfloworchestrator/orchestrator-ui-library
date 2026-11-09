import { useEffect, useMemo, useRef, useState } from 'react';

import { useLazySearchPathsQuery, useSearchDefinitionsQuery, useSearchPathsQuery } from '@/rtk/endpoints';
import { EntityKind, PathAutocompleteResponse, PathInfo, value_schema } from '@/types';

import { useDebounce } from './useDebounce';

const FALLBACK_DEFINITIONS: Record<
  string,
  {
    operators: string[];
    value_schema: Record<string, value_schema>;
  }
> = {
  string: {
    operators: ['eq', 'neq'],
    value_schema: {
      eq: { kind: 'string' },
      neq: { kind: 'string' },
    },
  },
  number: {
    operators: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'],
    value_schema: {
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
    value_schema: {
      eq: { kind: 'boolean' },
      neq: { kind: 'boolean' },
    },
  },
  datetime: {
    operators: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'],
    value_schema: {
      eq: { kind: 'datetime' },
      neq: { kind: 'datetime' },
      lt: { kind: 'datetime' },
      lte: { kind: 'datetime' },
      gt: { kind: 'datetime' },
      gte: { kind: 'datetime' },
    },
  },
};

type SearchDefinitions = typeof FALLBACK_DEFINITIONS;

const mapPathAutocompleteResponseToPathInfos = (
  pathData: PathAutocompleteResponse,
  definitions: SearchDefinitions,
): PathInfo[] => {
  const enrichedPaths: PathInfo[] = [];

  // Process leaves first
  (pathData.leaves || []).forEach((leaf) => {
    const primaryType = leaf.ui_types[0] || 'string';
    const typeDefinition = definitions[primaryType];

    enrichedPaths.push({
      path: leaf.name,
      type: primaryType as 'string' | 'number' | 'datetime' | 'boolean',
      operators: typeDefinition?.operators || [],
      value_schema: typeDefinition?.value_schema || {},
      group: 'leaf',
      displayLabel: leaf.name,
      ui_types: leaf.ui_types,
      availablePaths: leaf.paths || [],
      pathCount: leaf.paths ? leaf.paths?.length : 0,
    });
  });

  (pathData.components || []).forEach((component) => {
    const primaryType = component.ui_types[0] || 'string';
    const typeDefinition = definitions[primaryType];

    enrichedPaths.push({
      path: component.name,
      type: 'component',
      operators: typeDefinition?.operators || [],
      value_schema: typeDefinition?.value_schema || {},
      group: 'component',
      displayLabel: component.name,
      ui_types: component.ui_types,
      availablePaths: component.paths || [],
      pathCount: component.paths ? component.paths?.length : 0,
    });
  });

  return enrichedPaths;
};

export const usePathAutocomplete = (prefix: string, entityType: EntityKind) => {
  const debouncedPrefix = useDebounce(prefix, 300);
  const { data: definitions = FALLBACK_DEFINITIONS, isError: defError } = useSearchDefinitionsQuery();

  const {
    data: pathData,
    isFetching,
    isError,
  } = useSearchPathsQuery({ q: debouncedPrefix, entity_type: entityType }, { skip: debouncedPrefix.length < 1 });

  const paths = useMemo(
    () =>
      debouncedPrefix.length < 1 || !pathData ? [] : mapPathAutocompleteResponseToPathInfos(pathData, definitions),
    [pathData, definitions, debouncedPrefix.length],
  );

  const isDebouncing = prefix.length >= 1 && prefix !== debouncedPrefix;
  const loading = isDebouncing || isFetching;

  const errorMessage =
    isError ? 'Failed to load paths'
    : defError ? 'Failed to load definitions'
    : null;

  return { paths, loading, error: errorMessage };
};

/**
 * Resolves PathInfo for exact field paths that were never picked through the field
 * selector, e.g. the fields of a query restored from the URL. Returns a map that gains
 * an entry per field once its lookup settles: the matching PathInfo, or null when the
 * backend does not know the path. Each field is looked up at most once.
 */
export const useFieldsPathInfo = (fields: string[], entityType: EntityKind) => {
  const [fieldsPathInfo, setFieldsPathInfo] = useState<Map<string, PathInfo | null>>(new Map());
  const requestedFieldsRef = useRef<Set<string>>(new Set());
  const [fetchPaths] = useLazySearchPathsQuery();
  const { data: definitions, isError: definitionsFailed } = useSearchDefinitionsQuery();

  // Wait for the definitions request to settle so resolved fields get the backend's
  // operator lists instead of the fallback ones.
  const settledDefinitions = definitions ?? (definitionsFailed ? FALLBACK_DEFINITIONS : undefined);

  useEffect(() => {
    // Changing entity type invalidates previous lookups.
    requestedFieldsRef.current = new Set();
    setFieldsPathInfo(new Map());
  }, [entityType]);

  useEffect(() => {
    if (!settledDefinitions) {
      return;
    }
    const newFields = fields.filter((field) => field && !requestedFieldsRef.current.has(field));
    newFields.forEach((field) => {
      requestedFieldsRef.current.add(field);
      fetchPaths({ q: field, entity_type: entityType }, true)
        .unwrap()
        .then((pathData) => {
          const pathInfos = mapPathAutocompleteResponseToPathInfos(pathData, settledDefinitions);
          const match =
            pathInfos.find((pathInfo) => pathInfo.path === field)
            ?? pathInfos.find((pathInfo) => pathInfo.availablePaths?.includes(field));
          setFieldsPathInfo((previous) => new Map(previous).set(field, match ?? null));
        })
        .catch(() => {
          // Allow a retry on a later render, e.g. after a transient network error.
          requestedFieldsRef.current.delete(field);
        });
    });
  }, [fields, entityType, fetchPaths, settledDefinitions]);

  return fieldsPathInfo;
};
