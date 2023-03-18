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
    '\n    query SubscriptionGrid(\n        $first: Int!\n        $after: Int!\n        $sortBy: [SubscriptionsSort!]\n    ) {\n        subscriptions(first: $first, after: $after, sortBy: $sortBy) {\n            edges {\n                node {\n                    note\n                    name\n                    startDate\n                    endDate\n                    tag\n                    vlanRange\n                    description\n                    product {\n                        name\n                        type\n                        tag\n                    }\n                    insync\n                    status\n                    subscriptionId\n                }\n            }\n        }\n    }\n':
        types.SubscriptionGridDocument,
    '\n    query SubscriptionList {\n        subscriptions(first: 500) {\n            edges {\n                node {\n                    note\n                    name\n                    startDate\n                    endDate\n                    tag\n                    vlanRange\n                    description\n                    product {\n                        name\n                        type\n                        tag\n                    }\n                    insync\n                    status\n                    subscriptionId\n                }\n            }\n        }\n    }\n':
        types.SubscriptionListDocument,
    '\n    query GetSubscriptionDetailOutline($id: ID!) {\n        subscription(id: $id) {\n            customerId\n            description\n            endDate\n            firewallEnabled\n            fixedInputs\n            insync\n            note\n            product {\n                name\n                status\n                endDate\n                description\n                tag\n                type\n            }\n            startDate\n            status\n            subscriptionId\n            customerDescriptions {\n                description\n            }\n            organisation {\n                abbreviation\n                name\n                website\n                tel\n            }\n            locations {\n                abbreviation\n                name\n            }\n        }\n    }\n':
        types.GetSubscriptionDetailOutlineDocument,
    '\n    query GetSubscriptionDetailComplete($id: ID!) {\n        subscription(id: $id) {\n            note\n            name\n            startDate\n            endDate\n            tag\n            vlanRange\n            customerId\n            customerDescriptions {\n                description\n                customerId\n            }\n            description\n            firewallEnabled\n            fixedInputs\n            product {\n                name\n                status\n                endDate\n                tag\n                type\n                description\n                createdAt\n            }\n            status\n            locations {\n                name\n                email\n                website\n                abbreviation\n            }\n            inUseBy {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            dependsOn {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            organisation {\n                abbreviation\n                email\n                fax\n                name\n                status\n                tel\n                website\n                customerId\n            }\n            productBlocks {\n                resourceTypes\n                ownerSubscriptionId\n            }\n        }\n    }\n':
        types.GetSubscriptionDetailCompleteDocument,
    '\n    query GetSubscriptionDetailEnriched($id: ID!) {\n        subscription(id: $id) {\n            note\n            name\n            startDate\n            endDate\n            tag\n            vlanRange\n            customerId\n            customerDescriptions {\n                description\n                customerId\n            }\n            description\n            firewallEnabled\n            fixedInputs\n            product {\n                name\n                status\n                endDate\n                tag\n                type\n                description\n                createdAt\n            }\n            status\n            locations {\n                name\n                email\n                website\n                abbreviation\n            }\n            imsCircuits {\n                ims {\n                    id\n                    name\n                    extraInfo\n                    aliases\n                    allEndpoints {\n                        vlanranges\n                        ... on ImsPort {\n                            id\n                            connectorType\n                            fiberType\n                            ifaceType\n                            lineName\n                            node\n                            patchposition\n                            port\n                            status\n                            type\n                            vlanranges\n                        }\n                        id\n                        type\n                        ... on ImsInternalPort {\n                            id\n                            lineName\n                            node\n                            port\n                            type\n                            vlanranges\n                        }\n                        ... on ImsService {\n                            id\n                            location\n                            type\n                            vlanranges\n                        }\n                        location\n                    }\n                }\n            }\n            inUseBy {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            dependsOn {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            organisation {\n                abbreviation\n                email\n                fax\n                name\n                status\n                tel\n                website\n                customerId\n            }\n            productBlocks {\n                resourceTypes\n                ownerSubscriptionId\n            }\n        }\n    }\n':
        types.GetSubscriptionDetailEnrichedDocument,
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
export function graphql(
    source: '\n    query SubscriptionGrid(\n        $first: Int!\n        $after: Int!\n        $sortBy: [SubscriptionsSort!]\n    ) {\n        subscriptions(first: $first, after: $after, sortBy: $sortBy) {\n            edges {\n                node {\n                    note\n                    name\n                    startDate\n                    endDate\n                    tag\n                    vlanRange\n                    description\n                    product {\n                        name\n                        type\n                        tag\n                    }\n                    insync\n                    status\n                    subscriptionId\n                }\n            }\n        }\n    }\n',
): (typeof documents)['\n    query SubscriptionGrid(\n        $first: Int!\n        $after: Int!\n        $sortBy: [SubscriptionsSort!]\n    ) {\n        subscriptions(first: $first, after: $after, sortBy: $sortBy) {\n            edges {\n                node {\n                    note\n                    name\n                    startDate\n                    endDate\n                    tag\n                    vlanRange\n                    description\n                    product {\n                        name\n                        type\n                        tag\n                    }\n                    insync\n                    status\n                    subscriptionId\n                }\n            }\n        }\n    }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n    query SubscriptionList {\n        subscriptions(first: 500) {\n            edges {\n                node {\n                    note\n                    name\n                    startDate\n                    endDate\n                    tag\n                    vlanRange\n                    description\n                    product {\n                        name\n                        type\n                        tag\n                    }\n                    insync\n                    status\n                    subscriptionId\n                }\n            }\n        }\n    }\n',
): (typeof documents)['\n    query SubscriptionList {\n        subscriptions(first: 500) {\n            edges {\n                node {\n                    note\n                    name\n                    startDate\n                    endDate\n                    tag\n                    vlanRange\n                    description\n                    product {\n                        name\n                        type\n                        tag\n                    }\n                    insync\n                    status\n                    subscriptionId\n                }\n            }\n        }\n    }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n    query GetSubscriptionDetailOutline($id: ID!) {\n        subscription(id: $id) {\n            customerId\n            description\n            endDate\n            firewallEnabled\n            fixedInputs\n            insync\n            note\n            product {\n                name\n                status\n                endDate\n                description\n                tag\n                type\n            }\n            startDate\n            status\n            subscriptionId\n            customerDescriptions {\n                description\n            }\n            organisation {\n                abbreviation\n                name\n                website\n                tel\n            }\n            locations {\n                abbreviation\n                name\n            }\n        }\n    }\n',
): (typeof documents)['\n    query GetSubscriptionDetailOutline($id: ID!) {\n        subscription(id: $id) {\n            customerId\n            description\n            endDate\n            firewallEnabled\n            fixedInputs\n            insync\n            note\n            product {\n                name\n                status\n                endDate\n                description\n                tag\n                type\n            }\n            startDate\n            status\n            subscriptionId\n            customerDescriptions {\n                description\n            }\n            organisation {\n                abbreviation\n                name\n                website\n                tel\n            }\n            locations {\n                abbreviation\n                name\n            }\n        }\n    }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n    query GetSubscriptionDetailComplete($id: ID!) {\n        subscription(id: $id) {\n            note\n            name\n            startDate\n            endDate\n            tag\n            vlanRange\n            customerId\n            customerDescriptions {\n                description\n                customerId\n            }\n            description\n            firewallEnabled\n            fixedInputs\n            product {\n                name\n                status\n                endDate\n                tag\n                type\n                description\n                createdAt\n            }\n            status\n            locations {\n                name\n                email\n                website\n                abbreviation\n            }\n            inUseBy {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            dependsOn {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            organisation {\n                abbreviation\n                email\n                fax\n                name\n                status\n                tel\n                website\n                customerId\n            }\n            productBlocks {\n                resourceTypes\n                ownerSubscriptionId\n            }\n        }\n    }\n',
): (typeof documents)['\n    query GetSubscriptionDetailComplete($id: ID!) {\n        subscription(id: $id) {\n            note\n            name\n            startDate\n            endDate\n            tag\n            vlanRange\n            customerId\n            customerDescriptions {\n                description\n                customerId\n            }\n            description\n            firewallEnabled\n            fixedInputs\n            product {\n                name\n                status\n                endDate\n                tag\n                type\n                description\n                createdAt\n            }\n            status\n            locations {\n                name\n                email\n                website\n                abbreviation\n            }\n            inUseBy {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            dependsOn {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            organisation {\n                abbreviation\n                email\n                fax\n                name\n                status\n                tel\n                website\n                customerId\n            }\n            productBlocks {\n                resourceTypes\n                ownerSubscriptionId\n            }\n        }\n    }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n    query GetSubscriptionDetailEnriched($id: ID!) {\n        subscription(id: $id) {\n            note\n            name\n            startDate\n            endDate\n            tag\n            vlanRange\n            customerId\n            customerDescriptions {\n                description\n                customerId\n            }\n            description\n            firewallEnabled\n            fixedInputs\n            product {\n                name\n                status\n                endDate\n                tag\n                type\n                description\n                createdAt\n            }\n            status\n            locations {\n                name\n                email\n                website\n                abbreviation\n            }\n            imsCircuits {\n                ims {\n                    id\n                    name\n                    extraInfo\n                    aliases\n                    allEndpoints {\n                        vlanranges\n                        ... on ImsPort {\n                            id\n                            connectorType\n                            fiberType\n                            ifaceType\n                            lineName\n                            node\n                            patchposition\n                            port\n                            status\n                            type\n                            vlanranges\n                        }\n                        id\n                        type\n                        ... on ImsInternalPort {\n                            id\n                            lineName\n                            node\n                            port\n                            type\n                            vlanranges\n                        }\n                        ... on ImsService {\n                            id\n                            location\n                            type\n                            vlanranges\n                        }\n                        location\n                    }\n                }\n            }\n            inUseBy {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            dependsOn {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            organisation {\n                abbreviation\n                email\n                fax\n                name\n                status\n                tel\n                website\n                customerId\n            }\n            productBlocks {\n                resourceTypes\n                ownerSubscriptionId\n            }\n        }\n    }\n',
): (typeof documents)['\n    query GetSubscriptionDetailEnriched($id: ID!) {\n        subscription(id: $id) {\n            note\n            name\n            startDate\n            endDate\n            tag\n            vlanRange\n            customerId\n            customerDescriptions {\n                description\n                customerId\n            }\n            description\n            firewallEnabled\n            fixedInputs\n            product {\n                name\n                status\n                endDate\n                tag\n                type\n                description\n                createdAt\n            }\n            status\n            locations {\n                name\n                email\n                website\n                abbreviation\n            }\n            imsCircuits {\n                ims {\n                    id\n                    name\n                    extraInfo\n                    aliases\n                    allEndpoints {\n                        vlanranges\n                        ... on ImsPort {\n                            id\n                            connectorType\n                            fiberType\n                            ifaceType\n                            lineName\n                            node\n                            patchposition\n                            port\n                            status\n                            type\n                            vlanranges\n                        }\n                        id\n                        type\n                        ... on ImsInternalPort {\n                            id\n                            lineName\n                            node\n                            port\n                            type\n                            vlanranges\n                        }\n                        ... on ImsService {\n                            id\n                            location\n                            type\n                            vlanranges\n                        }\n                        location\n                    }\n                }\n            }\n            inUseBy {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            dependsOn {\n                description\n                name\n                product {\n                    name\n                }\n                startDate\n                status\n                subscriptionId\n            }\n            organisation {\n                abbreviation\n                email\n                fax\n                name\n                status\n                tel\n                website\n                customerId\n            }\n            productBlocks {\n                resourceTypes\n                ownerSubscriptionId\n            }\n        }\n    }\n'];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
