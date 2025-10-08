import { NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS } from '@/configuration';
import { orchestratorApi } from '@/rtk';
import { CacheTagType } from '@/types';
import {
    BaseGraphQlResult,
    SubscriptionDetail,
    SubscriptionDetailResult,
} from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

export const subscriptionDetailFragment = `
fragment SubscriptionDetail on SubscriptionInterface {
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
        productId
    }
    endDate
    startDate
    status
    customerId
    metadata
    customer {
        fullname
        customerId
        shortcode
    }
    customerDescriptions {
        id
        subscriptionId
        description
        customerId
    }
    productBlockInstances {
        id
        subscription {
            subscriptionId
            description
        }
        parent
        productBlockInstanceValues
        subscriptionInstanceId
        inUseByRelations
    }
    processes(first: ${NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS}, after: 0, sortBy: { field: "startedAt", order: ASC }) {
        page {
            processId
            lastStatus
            startedAt
            createdBy
            workflowTarget
            workflowName
            isTask
        }
    }
}
`;

export const subscriptionDetailQuery = `
    query SubscriptionDetail($subscriptionId: String!) {
        subscriptions(
            filterBy: { field: "subscriptionId", value: $subscriptionId }
        ) {
            page {
                ...SubscriptionDetail
            }
        }
    }
`;

export type SubscriptionDetailResponse = {
    subscription: SubscriptionDetail;
} & BaseGraphQlResult;

const subscriptionDetailApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionDetail: builder.query<
            SubscriptionDetailResponse,
            { subscriptionId: string }
        >({
            query: (variables) => ({
                document: subscriptionDetailQuery + subscriptionDetailFragment,
                variables,
            }),
            transformResponse: (
                response: SubscriptionDetailResult,
            ): SubscriptionDetailResponse => {
                const subscription = response.subscriptions.page[0] || [];
                const pageInfo = response.subscriptions.pageInfo || {};

                return {
                    subscription,
                    pageInfo,
                };
            },
            providesTags: (result, error, queryArguments) => {
                if (!error && result) {
                    return getCacheTag(
                        CacheTagType.subscriptions,
                        queryArguments.subscriptionId,
                    );
                }
                return [];
            },
        }),
    }),
});

export const { useGetSubscriptionDetailQuery } = subscriptionDetailApi;
