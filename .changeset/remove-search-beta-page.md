---
'@orchestrator-ui/orchestrator-ui-components': major
---

Removed the Search (beta) page and its related code.

Removed exports:

- Components: `WfoSearch`, `WfoSearchResults`, `WfoSearchResultItem`, `WfoSearchEmptyState`, `WfoSearchLoadingState`, `WfoSearchMetadataHeader`, `WfoSearchPaginationInfo`, `WfoPathBreadcrumb`, `FilterGroup`, `WfoConditionRow` (and its selectors), `WfoValueControl`, `WfoAvailabilityCheck`, `WfoBackendUnavailable`.
- Search page utils from `WfoSearchPage/utils` (e.g. `buildSearchParams`, `isFilterValid`, `getDetailUrl`, `ENTITY_TABS`).
- Hooks: `useSearchAvailability`.
- RTK: `useLazySearchQuery`, `useSearchWithPaginationMutation`, `useCheckSearchAvailabilityQuery`, `SearchPaginationPayload`.
- The `search.availability` and search page-only `search.page` translations.

`WfoHighlightedText` is still exported, it moved to `components/WfoHighlightedText`.
If your app has a `/search` page or a `Search` menu item using `WfoSearch`, remove them.
