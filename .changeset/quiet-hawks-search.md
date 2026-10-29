---
"@orchestrator-ui/orchestrator-ui-components": minor
---

The subscriptions list page now uses the GraphQL `subscriptions` search instead of the REST search endpoint.

- Only the visible columns are requested.
- The optimistic note edit patches the new cache shape.
- camelCase highlight_indices and matching_fields.
