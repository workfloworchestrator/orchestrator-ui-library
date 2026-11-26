---
"@orchestrator-ui/orchestrator-ui-components": patch
---

295 Fixes for the new (beta) workflow layouts:

- Start workflow: a modify or terminate workflow shows which subscription it changes (product, customer, link to the subscription) under the title.
- Start workflow: a summary page counts as the last page, so the step list shows no "Next steps" placeholder there.
- Start workflow: while the next page loads, a skeleton in the shape of a step shows instead of "Loading...", so the panel keeps its size.
- Start workflow: on the first load the known parts show at once ("Step 1", step 1 as the current step in the step list); the workflow title, subscription line, step title and fields show a skeleton of their size until they load, so nothing moves.
- Process detail: the websocket badge, the information link and the status badge each keep their own space (they overlapped, most visibly when the websocket is disconnected).
- Process detail: the shadows of the step cards no longer show next to and below the sticky header while you scroll.
- Both pages: the collapsed user guide is no longer cut off at the top when you scroll to the bottom of the page.
