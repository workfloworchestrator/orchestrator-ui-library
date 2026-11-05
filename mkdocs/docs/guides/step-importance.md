# Step Importance and Detail Levels

Every workflow step in Orchestrator Core carries an `importance` value: `low`, `default` or `high`. The backend
stores it on each process step and exposes it through the process APIs; the backend engine itself does nothing with
it. How a step author sets the importance is documented in the
[Orchestrator Core workflow steps docs](https://workfloworchestrator.org/orchestrator-core/reference-docs/workflows/workflow-steps/#step-importance).

The orchestrator UI uses importance to decide how much of each step to show in the process detail page. This page
describes that mapping. It requires Orchestrator Core 5.6 or newer; older backends do not support the process
detail query, see the [Frontend / Backend Compatibility](compatibility.md) guide.

## Presentations

Each step is rendered in one of three presentations:

- **Minimal**: a single compact row with the status icon and the step name. The name can be hidden with the
  "Hide minimal step name" toggle; it reappears on hover.
- **Standard**: the regular step card with name, status and duration, collapsed.
- **Verbose**: the step card expanded, showing the state and subscription delta.

## Detail level selector

The process detail page has a **Detail** selector with three levels: Minimal, Standard and Verbose. It replaces the
former "Expand all" toggle. The selected level combined with the importance of a step determines its presentation:

| Detail level | `high` step | `default` step | `low` step |
| ------------ | ----------- | -------------- | ---------- |
| Minimal      | Standard    | Minimal        | Minimal    |
| Standard     | Verbose     | Standard       | Minimal    |
| Verbose      | Verbose     | Verbose        | Standard   |

Steps that need attention are never collapsed to Minimal, regardless of importance. A running step, a suspended step
waiting for user input, and a failed step at the end of the process are shown at least as Standard.

## Interacting with steps

Clicking a step expands it one presentation level: Minimal becomes Standard and Standard becomes Verbose. Clicking a
Verbose step shrinks it back to its base presentation for the current detail level. A step without state to show
cannot be expanded to Verbose and goes back to Minimal directly when that is its base.

Navigating to a step from the timeline shows that step as Standard when it would otherwise be Minimal, and as Verbose
otherwise.
