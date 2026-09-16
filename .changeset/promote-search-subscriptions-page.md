---
'@orchestrator-ui/orchestrator-ui-components': major
---

Promote the search based subscriptions list page (previously `WfoSearchPocPage` on `/beta-subscriptions`) to `WfoSubscriptionsListPage`. Removes the GraphQL based `WfoSubscriptionsList` component, the `getSubscriptionList` RTK endpoint and its mappers, `WfoSearchPocPage` and `PATH_SUBSCRIPTIONS_BETA`. Links to the subscriptions list now use the `filterString`/`queryString` URL parameters of the search page.
