---
'@orchestrator-ui/orchestrator-ui-components': major
---

Introduces new search on the subscription list page. The search now offers filtering and searching with an optional embedding to support semantic search.

Breaking changes: `WfoSearchPocPage`, `PATH_SUBSCRIPTIONS_BETA`, the GraphQL based `WfoSubscriptionsList` component and the `mapGraphQlSubscriptionsResultToSubscriptionListItems`/`mapGraphQlSubscriptionsResultToPageInfo` mappers are removed. `SubscriptionListItem` no longer has a `customerId` field. Links to the subscriptions list page should use the `activeTab`, `queryString` and `filterString` (CEL) URL parameters; `sortBy`, `page` and `pageSize` are no longer read.
