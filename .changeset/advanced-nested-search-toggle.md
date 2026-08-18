---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Add an "Advanced nested search" toggle to the search table settings. When disabled, the filter builder's field selector hides all fully qualified (dotted) paths from the autocomplete suggestions (e.g. subscription.ip_peer_group_block.peer_type) and only offers plain field names (e.g. peer_type); the prefilled field options are unaffected. The setting is persisted with the other table settings and defaults to enabled.
