import { parse } from 'graphql';
import { gql } from 'graphql-request';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import {
    GraphqlQueryVariables,
    ProductDefinition,
    ProductDefinitionsResult,
    SubscriptionsResult,
} from '../types';

export const GET_PRODUCTS_GRAPHQL_QUERY = parse(gql`
    query MetadataProducts(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $query: String
    ) {
        products(first: $first, after: $after, sortBy: $sortBy, query: $query) {
            page {
                productId
                name
                description
                tag
                createdAt
                productType
                status
                productBlocks {
                    name
                }
                fixedInputs {
                    name
                    value
                }
                endDate
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
                totalItems
                sortFields
                filterFields
            }
        }
    }
`);

export const GET_PRODUCTS_SUMMARY_GRAPHQL_QUERY = parse(gql`
    query MetadataProducts(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
    ) {
        products(first: $first, after: $after, sortBy: $sortBy) {
            page {
                name
                subscriptions {
                    pageInfo {
                        totalItems
                    }
                }
            }
            pageInfo {
                totalItems
                startCursor
                endCursor
            }
        }
    }
`);

export const getProductsSummaryQuery = (): TypedDocumentNode<
    ProductDefinitionsResult<
        Pick<ProductDefinition, 'name'> & SubscriptionsResult<never>
    >,
    GraphqlQueryVariables<ProductDefinition>
> => GET_PRODUCTS_SUMMARY_GRAPHQL_QUERY;

export const getProductsQuery = (): TypedDocumentNode<
    ProductDefinitionsResult,
    GraphqlQueryVariables<ProductDefinition>
> => GET_PRODUCTS_GRAPHQL_QUERY;
