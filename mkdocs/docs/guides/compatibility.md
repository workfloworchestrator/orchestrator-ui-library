# Frontend / Backend Compatibility

Orchestrator UI Library (this repository) and [Orchestrator Core](https://github.com/workfloworchestrator/orchestrator-core)
(the backend) are versioned and released independently. New frontend functionality sometimes depends on API changes
that only exist from a certain Core version onward.

The table below lists, for each Orchestrator UI Library version that introduced a new backend dependency, the
minimum Orchestrator Core version it requires. Versions not listed have no new minimum — use the closest preceding
row. The frontend also checks this at runtime against `version-compatibility.json` and shows a warning badge when
the connected backend is too old.

| Orchestrator UI version | Minimum Orchestrator Core version | Why                                                                                                                         |
| ------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 9.0.0                     | 5.4.0                               | Adds new structured search endpoints to the backend.                                                                       |
| 7.8.0                     | 5.0.0                               | Endpoints in the backend to modify the lifecycle status of a product.                                                      |
| 7.7.0                     | 5.0.0                               | A note field was added to a process.                                                                                       |
| 6.5.0                     | 4.6.0                               | To support new functionality in the frontend for the Agent and LLM, the backend endpoints changed.                         |
| 5.3.5                     | 4.2.0                               | Endpoints in the backend to support RBAC on individual running workflows, and new GraphQL `started`/`completed` props used to improve process detail timestamps. |
| 5.0.0                     | 4.0.0                               | Breaking change on `Workflow.target`, added `VALIDATION`. Check whether you need to update your workflows.                 |
| 3.4.0                     | 2.10.0                              | Endpoints in the backend to modify the description on metadata pages.                                                      |

## Source of truth

This table is maintained by hand and must stay in sync with
[`version-compatibility.json`](https://github.com/workfloworchestrator/orchestrator-ui-library/blob/main/version-compatibility.json)
in the root of this repository, which the frontend reads at runtime. When adding a new minimum-version entry to that
file, add a matching row here in the same pull request.

## Related upgrade guides

Some entries above have a dedicated upgrade guide with detailed migration steps:

- [8.1 Upgrade Guide](./upgrading/8.1.md)
- [8.4 Upgrade Guide](./upgrading/8.4.md)
- [9.0 Upgrade Guide](./upgrading/9.0.md)
