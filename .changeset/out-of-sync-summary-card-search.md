---
'@orchestrator-ui/orchestrator-ui-components': minor
---

`WfoLatestOutOfSyncSubscriptionSummaryCard` now fetches its data through the search endpoint with an Elasticsearch filter instead of the GraphQL subscriptions summary query, so its count matches the filtered subscriptions list page it links to. Adds `mapSubscriptionSearchResultToSummaryCardListItem`. The `outOfSyncSubscriptionsListSummaryQueryVariables` export is removed.
