import { parse } from 'graphql';
import { gql } from 'graphql-request';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import {
    GraphqlQueryVariables,
    SubscriptionDropdownOption,
    SubscriptionDropdownOptionsResult,
} from '../types';

// Avoiding pagination by passing a large number to first. TODO: Fix this better
export const GET_SUBSCRIPTION_DROPDOWN_OPTIONS_GRAPHQL_QUERY = parse(gql`
    query SubscriptionDropdownOptions($filterBy: [GraphqlFilter!]) {
        subscriptions(filterBy: $filterBy, first: 1000000, after: 0) {
            page {
                description
                subscriptionId
                product {
                    tag
                    productId
                }
                customer {
                    fullname
                    identifier
                }
                productBlockInstances {
                    id
                    ownerSubscriptionId
                    parent
                    productBlockInstanceValues
                    subscriptionInstanceId
                    inUseByRelations
                }
                fixedInputs
            }
        }
    }
`);

export function getSubscriptionDropdownOptionsGraphQlQuery<
    QueryVariablesType = SubscriptionDropdownOption,
>(): TypedDocumentNode<
    SubscriptionDropdownOptionsResult,
    GraphqlQueryVariables<QueryVariablesType>
> {
    return GET_SUBSCRIPTION_DROPDOWN_OPTIONS_GRAPHQL_QUERY;
}
