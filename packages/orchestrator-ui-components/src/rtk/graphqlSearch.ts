import type { WfoDataSorting } from '@/components/WfoTable/utils/columns';
import type { SearchPayload } from '@/rtk/endpoints/search';
import type { Filter, GraphQLPageInfo, MatchingField, ResultColumToPropertyMap, RetrieverType } from '@/types';

// Building blocks shared by the lists that use the GraphQL `search`.

export type GraphqlSearchPayload = Omit<SearchPayload, 'entity_type' | 'response_columns'> & {
  // GraphQL fields of the requested columns, e.g. 'startDate' or 'product.name'
  columns: string[];
  // Only for a structured search, a text query pages with a cursor
  offset?: number;
};

export type GraphqlSearchEdge<Node> = {
  score: number;
  matchingFields: MatchingField[];
  node: Node;
};

export type GraphqlSearchResponse<Node> = {
  searchEdges: GraphqlSearchEdge<Node>[];
  pageInfo: Pick<GraphQLPageInfo, 'totalItems' | 'hasNextPage'>;
  nextPageCursor: string | null;
};

export const getSearchPath = <T>(searchPathToProperty: ResultColumToPropertyMap<T>, property: keyof T) =>
  [...searchPathToProperty].find(([, mappedProperty]) => mappedProperty === property)?.[0] ?? '';

type BuildGraphqlSearchPayloadOptions<T> = {
  searchPathToProperty: ResultColumToPropertyMap<T>;
  alwaysRequestedProperties: (keyof T)[];
  hiddenColumns: (keyof T)[];
  dataSorting: WfoDataSorting<T>;
  query: string;
  pageSize: number;
  retrieverType: RetrieverType;
  filters?: Filter;
  cursor?: string;
  offset?: number;
};

export const buildGraphqlSearchPayload = <T>({
  searchPathToProperty,
  alwaysRequestedProperties,
  hiddenColumns,
  dataSorting,
  query,
  pageSize,
  retrieverType,
  filters,
  cursor,
  offset,
}: BuildGraphqlSearchPayloadOptions<T>): GraphqlSearchPayload => ({
  query,
  limit: pageSize,
  columns: [...searchPathToProperty.values()]
    .filter((property) => alwaysRequestedProperties.includes(property) || !hiddenColumns.includes(property))
    .map(String),
  order_by: {
    element: getSearchPath(searchPathToProperty, dataSorting.field),
    direction: dataSorting.sortOrder.toLowerCase(),
  },
  ...(retrieverType !== 'auto' && { retriever: retrieverType }),
  ...(filters && { filters }),
  ...(cursor && { cursor }),
  ...(offset !== undefined && { offset }),
});

// 'product.name' -> 'product { name }'
export const toSelection = (path: string) =>
  path.split('.').reduceRight((inner, field) => (inner ? `${field} { ${inner} }` : field), '');

export const getSearchVariables = ({
  query,
  filters,
  limit,
  retriever,
  order_by,
  cursor,
  offset,
}: GraphqlSearchPayload) => ({
  first: Array.isArray(limit) ? limit[0] : (limit ?? 10),
  after: offset ?? 0,
  search: {
    query: query || undefined,
    elasticFilters: filters,
    retriever: retriever && retriever !== 'auto' ? retriever.toUpperCase() : undefined,
    // Same as the REST endpoint: ordering only applies to a structured search, not to a text query
    orderBy:
      order_by && !query ? { element: order_by.element, direction: order_by.direction.toUpperCase() } : undefined,
    cursor,
  },
});

export type SearchScore = { score: number; matchingFields: MatchingField[] };
