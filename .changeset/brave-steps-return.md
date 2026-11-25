---
"@orchestrator-ui/orchestrator-ui-components": minor
---

295 New layouts (beta) for the start-workflow and process detail pages, behind a "Layout: Classic | New (beta)" toggle. The toggle is off by default: set `showBetaWorkflowLayoutToggle` in the `OrchestratorConfig` (the app reads it from its own env var, e.g. `SHOW_BETA_WORKFLOW_LAYOUT_TOGGLE`) to show it. Without it only the classic layout shows. The choice is stored in localStorage.

- Start workflow: vertical step list as a rail that expands on hover or focus, Back link above the step title, Next and Cancel under the form, focus moves to the step title on each step change.
- Start workflow: the step count stays correct when you go back.
- Start workflow: the Next button has the same `id` and `data-testid` (`button-submit-form-submit`) as in the classic layout. Escape in a dropdown or dialog no longer collapses the step list.
- Start workflow: list fields (`WfoBetaArrayField`) as cards with add and remove buttons with text. Cards follow the backend field layout when wider than 640px (narrower cards show one field per line). A list of lists shows each group as a box with "Add item" inside and "Add group" below; a group keeps at least 1 item, and a required list keeps at least 1 group.
- Workflow guide as an edge tab (`WfoTuckedGuide`, `WfoEdgeTab`) next to the form; opening it does not move the form.
- Process detail: compact header with an info line, failure banner and step label in the timeline.
- `WfoPydanticForm` accepts custom `renderers` and `componentOverrides`. An app's own matchers still win over `componentOverrides`.
- `createWfoBetaArrayField(useOptions)` makes a list field with its own item label, add button text, leading field and lock reason. `useIsBetaLayout` and `BetaPageFieldsContext` let app fields follow the new layout.
- `WfoReactSelect`: the refresh button moved to the right, has a tooltip and is disabled while loading.
- Form fields (also in the classic layout and in search fields) use EUI's form background colours, so enabled fields no longer look disabled.
- Small props: `WfoContentHeader` `spacerSize`, `WfoProcessStatusBadge` `size`, `WfoTimeline` `labelIndex` and `labelColor`.
