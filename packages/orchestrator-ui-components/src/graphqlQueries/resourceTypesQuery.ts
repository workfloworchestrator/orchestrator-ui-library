import { gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import {ResourceTypeDefinitionsResult, SortOrder} from '../types';

import type { ResourceTypeDefinition } from '../types';
import { GraphqlQueryVariables } from '../types';

export const DEFAULT_RESOURCE_TYPE_SORT_FIELD: keyof ResourceTypeDefinition =
    'description';
export const DEFAULT_RESOURCE_TYPE_SORT_ORDER: SortOrder = SortOrder.DESC;

export const GET_RESOURCE_TYPES_GRAPHQL_QUERY: TypedDocumentNode<
    ResourceTypeDefinitionsResult,
    GraphqlQueryVariables<ResourceTypeDefinition>
> = parse(gql`
    query MetadataResourceTypes(
        $first: IntType!
        $after: IntType!
        $sortBy: [GraphqlSort!]
    ) {
        resourceTypes(first: $first, after: $after, sortBy: $sortBy) {
            page {
                description
                resourceTypeId
                resourceType
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
                totalItems
            }
        }
    }
`);
