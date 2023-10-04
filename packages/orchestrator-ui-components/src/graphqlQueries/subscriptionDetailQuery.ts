import { parse } from 'graphql';
import { gql } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { SubscriptionDetailResult } from '../types';

export const GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY: TypedDocumentNode<
    SubscriptionDetailResult,
    { subscriptionId: string }
> = parse(gql`
    query SubscriptionDetail($subscriptionId: String!) {
        subscriptions(
            filterBy: { value: $subscriptionId, field: "subscriptionId" }
        ) {
            page {
                subscriptionId
                description
                fixedInputs
                insync
                note
                product {
                    createdAt
                    name
                    status
                    endDate
                    description
                    tag
                    productType
                }
                endDate
                startDate
                status
                productBlockInstances {
                    id
                    ownerSubscriptionId
                    parent
                    productBlockInstanceValues
                }
            }
        }
    }
`);
