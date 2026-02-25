import { useEffect, useState } from 'react';

import { useSearchDefinitionsQuery, useSearchPathsQuery } from '@/rtk/endpoints';
import { EntityKind, PathInfo, value_schema } from '@/types';

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

export const usePathAutocomplete = (prefix: string, entityType: EntityKind) => {
  const [paths, setPaths] = useState<PathInfo[]>([]);
  const debouncedPrefix = useDebounce(prefix, 300);

  const { data: definitions = FALLBACK_DEFINITIONS, isError: defError } = useSearchDefinitionsQuery();

  const {
    data: pathData,
    isLoading,
    isError,
  } = useSearchPathsQuery({ q: debouncedPrefix, entity_type: entityType }, { skip: debouncedPrefix.length < 1 });

  useEffect(() => {
    if (debouncedPrefix.length < 1) {
      setPaths([]);
      return;
    }

    if (!pathData) {
      return;
    }

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
        pathCount: leaf.paths ? leaf.paths.length : 0,
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
        pathCount: component.paths ? component.paths.length : 0,
      });
    });

    setPaths(enrichedPaths);
  }, [pathData, definitions, debouncedPrefix.length]);

  const errorMessage =
    isError ? 'Failed to load paths'
    : defError ? 'Failed to load definitions'
    : null;

  return { paths, loading: isLoading, error: errorMessage };
};
