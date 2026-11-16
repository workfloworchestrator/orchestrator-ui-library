---
"@orchestrator-ui/orchestrator-ui-components": minor
---

295 New layouts (beta) for the start-workflow and process detail pages, behind a "Layout: Classic | New (beta)" toggle. The choice is stored in localStorage.

- Start workflow: vertical step list as a rail that expands on hover or focus, Back link above the step title, Next and Cancel under the form, focus moves to the step title on each step change.
- Start workflow: the step count stays correct when you go back.
- Start workflow: list fields (`WfoArrayFieldV2`) as cards with add and remove buttons with text.
- Workflow guide as an edge tab (`WfoTuckedGuide`, `WfoEdgeTab`) next to the form; opening it does not move the form.
- Process detail: compact header with an info line, failure banner and step label in the timeline.
- `WfoPydanticForm` accepts custom `renderers` and `componentOverrides`.
- `WfoReactSelect`: the refresh button moved to the right, has a tooltip and is disabled while loading.
- Small props: `WfoContentHeader` `spacerSize`, `WfoProcessStatusBadge` `size`, `WfoTimeline` `labelIndex` and `labelColor`.
