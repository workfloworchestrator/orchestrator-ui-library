import { CacheTags, orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    SubscriptionDetail,
    SubscriptionDetailResult,
} from '@/types';

export const subscriptionDetailQuery = `
    query SubscriptionDetail($subscriptionId: String!) {
        subscriptions(
            filterBy: { field: "subscriptionId", value: $subscriptionId }
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
                    subscriptionId
                    description
                    customerId
                }
                productBlockInstances {
                    id
                    ownerSubscriptionId
                    parent
                    productBlockInstanceValues
                    subscriptionInstanceId
                    inUseByRelations
                }
                processes(sortBy: { field: "startedAt", order: ASC }) {
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
                document: subscriptionDetailQuery,
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
            providesTags: (result, error, arg) => [
                {
                    type: CacheTags.subscription,
                    id: arg.subscriptionId,
                },
            ],
        }),
    }),
});

export const { useGetSubscriptionDetailQuery } = subscriptionDetailApi;
