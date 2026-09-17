---
'@orchestrator-ui/orchestrator-ui-components': minor
---

`WfoLatestActiveSubscriptionsSummaryCard` and `WfoLatestOutOfSyncSubscriptionSummaryCard` now fetch their data through the search endpoint with an Elasticsearch filter instead of the GraphQL subscriptions summary query, so their counts match the subscriptions list page they link to. Adds `getSubscriptionSummarySearchPayload` and `mapSubscriptionSearchResultToSummaryCardListItem` for building similar cards.

Removed: the `useGetSubscriptionSummaryListQuery` hook with its `subscriptionListSummaryQuery` document and `SubscriptionListSummaryResponse` type, the `SubscriptionSummary` type, the `mapSubscriptionSummaryToSummaryCardListItem` mapper, and the `subscriptionsListSummaryQueryVariables` / `outOfSyncSubscriptionsListSummaryQueryVariables` query variables.
