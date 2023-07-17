/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    query MetadataProducts(\n        $first: Int!\n        $after: Int!\n        $sortBy: [GraphqlSort!]\n    ) {\n        products(first: $first, after: $after, sortBy: $sortBy) {\n            page {\n                name\n                description\n                tag\n                createdAt\n                productType\n                status\n                productBlocks {\n                    name\n                }\n            }\n            pageInfo {\n                endCursor\n                hasNextPage\n                hasPreviousPage\n                startCursor\n                totalItems\n            }\n        }\n    }\n": types.MetadataProductsDocument,
    "\n    query SubscriptionDetailOutline($id: String!) {\n        subscriptions(filterBy: { field: \"subscriptionId\", value: $id }) {\n            # page is array but in this case only 1 entry\n            page {\n                subscriptionId\n                # does not exist\n                # customerId\n                description\n                # todo should be implemented by backend\n                # fixedInputs\n                insync\n                note\n                product {\n                    createdAt\n                    name\n                    status\n                    endDate\n                    description\n                    tag\n                    # type\n                    productType\n                }\n                endDate\n                startDate\n                status\n                # org is removed\n                # organisation {\n                #     abbreviation\n                #     name\n                #     website\n                #     tel\n                # }\n                productBlocks {\n                    id\n                    ownerSubscriptionId\n                    parent\n                    resourceTypes\n                }\n            }\n        }\n    }\n": types.SubscriptionDetailOutlineDocument,
    "\n    query SubscriptionDetailComplete($id: String!) {\n        subscriptions(filterBy: { field: \"subscriptionId\", value: $id }) {\n            # page is array but in this case only 1 entry\n            page {\n                subscriptionId\n                # does not exist\n                # customerId\n                description\n                # todo should be implemented by backend\n                # fixedInputs\n                insync\n                note\n                product {\n                    createdAt\n                    name\n                    status\n                    endDate\n                    description\n                    tag\n                    # type\n                    productType\n                }\n                endDate\n                startDate\n                status\n                # org is removed\n                # organisation {\n                #     abbreviation\n                #     name\n                #     website\n                #     tel\n                # }\n                productBlocks {\n                    id\n                    ownerSubscriptionId\n                    parent\n                    resourceTypes\n                }\n            }\n        }\n    }\n": types.SubscriptionDetailCompleteDocument,
    "\n    query SubscriptionsTable(\n        $first: Int!\n        $after: Int!\n        $sortBy: [GraphqlSort!]\n        $filterBy: [GraphqlFilter!]\n    ) {\n        subscriptions(\n            first: $first\n            after: $after\n            sortBy: $sortBy\n            filterBy: $filterBy\n        ) {\n            page {\n                note\n                startDate\n                endDate\n                description\n                insync\n                status\n                subscriptionId\n                product {\n                    name\n                    tag\n                    productType\n                }\n            }\n            pageInfo {\n                totalItems\n                startCursor\n                hasPreviousPage\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n": types.SubscriptionsTableDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MetadataProducts(\n        $first: Int!\n        $after: Int!\n        $sortBy: [GraphqlSort!]\n    ) {\n        products(first: $first, after: $after, sortBy: $sortBy) {\n            page {\n                name\n                description\n                tag\n                createdAt\n                productType\n                status\n                productBlocks {\n                    name\n                }\n            }\n            pageInfo {\n                endCursor\n                hasNextPage\n                hasPreviousPage\n                startCursor\n                totalItems\n            }\n        }\n    }\n"): (typeof documents)["\n    query MetadataProducts(\n        $first: Int!\n        $after: Int!\n        $sortBy: [GraphqlSort!]\n    ) {\n        products(first: $first, after: $after, sortBy: $sortBy) {\n            page {\n                name\n                description\n                tag\n                createdAt\n                productType\n                status\n                productBlocks {\n                    name\n                }\n            }\n            pageInfo {\n                endCursor\n                hasNextPage\n                hasPreviousPage\n                startCursor\n                totalItems\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SubscriptionDetailOutline($id: String!) {\n        subscriptions(filterBy: { field: \"subscriptionId\", value: $id }) {\n            # page is array but in this case only 1 entry\n            page {\n                subscriptionId\n                # does not exist\n                # customerId\n                description\n                # todo should be implemented by backend\n                # fixedInputs\n                insync\n                note\n                product {\n                    createdAt\n                    name\n                    status\n                    endDate\n                    description\n                    tag\n                    # type\n                    productType\n                }\n                endDate\n                startDate\n                status\n                # org is removed\n                # organisation {\n                #     abbreviation\n                #     name\n                #     website\n                #     tel\n                # }\n                productBlocks {\n                    id\n                    ownerSubscriptionId\n                    parent\n                    resourceTypes\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query SubscriptionDetailOutline($id: String!) {\n        subscriptions(filterBy: { field: \"subscriptionId\", value: $id }) {\n            # page is array but in this case only 1 entry\n            page {\n                subscriptionId\n                # does not exist\n                # customerId\n                description\n                # todo should be implemented by backend\n                # fixedInputs\n                insync\n                note\n                product {\n                    createdAt\n                    name\n                    status\n                    endDate\n                    description\n                    tag\n                    # type\n                    productType\n                }\n                endDate\n                startDate\n                status\n                # org is removed\n                # organisation {\n                #     abbreviation\n                #     name\n                #     website\n                #     tel\n                # }\n                productBlocks {\n                    id\n                    ownerSubscriptionId\n                    parent\n                    resourceTypes\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SubscriptionDetailComplete($id: String!) {\n        subscriptions(filterBy: { field: \"subscriptionId\", value: $id }) {\n            # page is array but in this case only 1 entry\n            page {\n                subscriptionId\n                # does not exist\n                # customerId\n                description\n                # todo should be implemented by backend\n                # fixedInputs\n                insync\n                note\n                product {\n                    createdAt\n                    name\n                    status\n                    endDate\n                    description\n                    tag\n                    # type\n                    productType\n                }\n                endDate\n                startDate\n                status\n                # org is removed\n                # organisation {\n                #     abbreviation\n                #     name\n                #     website\n                #     tel\n                # }\n                productBlocks {\n                    id\n                    ownerSubscriptionId\n                    parent\n                    resourceTypes\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query SubscriptionDetailComplete($id: String!) {\n        subscriptions(filterBy: { field: \"subscriptionId\", value: $id }) {\n            # page is array but in this case only 1 entry\n            page {\n                subscriptionId\n                # does not exist\n                # customerId\n                description\n                # todo should be implemented by backend\n                # fixedInputs\n                insync\n                note\n                product {\n                    createdAt\n                    name\n                    status\n                    endDate\n                    description\n                    tag\n                    # type\n                    productType\n                }\n                endDate\n                startDate\n                status\n                # org is removed\n                # organisation {\n                #     abbreviation\n                #     name\n                #     website\n                #     tel\n                # }\n                productBlocks {\n                    id\n                    ownerSubscriptionId\n                    parent\n                    resourceTypes\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SubscriptionsTable(\n        $first: Int!\n        $after: Int!\n        $sortBy: [GraphqlSort!]\n        $filterBy: [GraphqlFilter!]\n    ) {\n        subscriptions(\n            first: $first\n            after: $after\n            sortBy: $sortBy\n            filterBy: $filterBy\n        ) {\n            page {\n                note\n                startDate\n                endDate\n                description\n                insync\n                status\n                subscriptionId\n                product {\n                    name\n                    tag\n                    productType\n                }\n            }\n            pageInfo {\n                totalItems\n                startCursor\n                hasPreviousPage\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n"): (typeof documents)["\n    query SubscriptionsTable(\n        $first: Int!\n        $after: Int!\n        $sortBy: [GraphqlSort!]\n        $filterBy: [GraphqlFilter!]\n    ) {\n        subscriptions(\n            first: $first\n            after: $after\n            sortBy: $sortBy\n            filterBy: $filterBy\n        ) {\n            page {\n                note\n                startDate\n                endDate\n                description\n                insync\n                status\n                subscriptionId\n                product {\n                    name\n                    tag\n                    productType\n                }\n            }\n            pageInfo {\n                totalItems\n                startCursor\n                hasPreviousPage\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;