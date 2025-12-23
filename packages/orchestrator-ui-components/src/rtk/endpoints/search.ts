import { getEndpointPath } from '@/components/WfoSearchPage/utils';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
    EntityKind,
    Group,
    PaginatedSearchResults,
    PathAutocompleteResponse,
    RetrieverType,
    value_schema,
} from '@/types';

export interface SearchPayload {
    entity_type: EntityKind;
    query: string;
    filters?: Group;
    limit?: number;
    retriever?: Exclude<RetrieverType, 'auto'>;
}

export interface SearchPaginationPayload extends SearchPayload {
    cursor: number;
}

export interface SearchDefinitionsResponse {
    [key: string]: {
        operators: string[];
        value_schema: Record<string, value_schema>;
    };
}

const searchApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        search: build.mutation<PaginatedSearchResults, SearchPayload>({
            query: ({ entity_type, query, filters, limit, retriever }) => ({
                url: `search/${getEndpointPath(entity_type)}`,
                method: 'POST',
                body: { query, filters, limit, retriever },
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        searchWithPagination: build.mutation<
            PaginatedSearchResults,
            SearchPaginationPayload
        >({
            query: ({ cursor, entity_type, query, filters, limit, retriever }) => ({
                url: `search/${getEndpointPath(entity_type)}?cursor=${cursor}`,
                method: 'POST',
                body: { query, filters, limit, retriever },
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        searchPaths: build.query<
            PathAutocompleteResponse,
            { q: string; entity_type: EntityKind }
        >({
            query: ({ q, entity_type }) => ({
                url: `search/paths?q=${encodeURIComponent(
                    q,
                )}&entity_type=${entity_type}`,
                method: 'GET',
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        searchDefinitions: build.query<SearchDefinitionsResponse, void>({
            query: () => ({
                url: 'search/definitions',
                method: 'GET',
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
    }),
});

export const {
    useSearchMutation,
    useSearchWithPaginationMutation,
    useSearchPathsQuery,
    useSearchDefinitionsQuery,
} = searchApi;
