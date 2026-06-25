# Create IP Peer Group

Creates a new IP Peer Group subscription and provisions it in NSO. Use this workflow to set up BGP peering configuration for a research or commercial network partner.

## Fields

### Ticket ID

**What it is:** Reference to the Jira ticket that tracks this change request.

**Valid values:** A valid Jira ticket ID, e.g. `IPAM-1234`. Leave empty if no ticket applies.

**Constraints:** Optional. When provided, must match the Jira ticket ID format.

---

### Peer Group Name

**What it is:** A unique identifier for this peer group, used as the service name in NSO and the subscription description.

**Valid values:** Letters, digits, and hyphens only. Example: `AMS-IX-Research`.

**Constraints:** Must be unique across all IP Peer Group subscriptions. No spaces or special characters.

---

### Peer Type

**What it is:** Classifies the network type of the peering partner, which determines the applicable routing policy.

**Valid values:**

- `research-network` — Research and education network partner
- `commercial-network` — Commercial network partner

---

### Interconnection Type

**What it is:** The physical or logical interconnection method used to reach the peer.

**Valid values:**

- `ix` — Internet Exchange Point
- `pni` — Private Network Interconnect (direct peering)
- `transit` — Transit provider

---

### Peer Community

**What it is:** The BGP community value (ASN) associated with this peer group, used in routing policy for traffic classification.

**Valid values:** Integer between 1 and 4,294,967,294. Optional — leave empty if no community value is needed.

---

### Metric Out

**What it is:** The BGP MED (Multi-Exit Discriminator) value advertised to this peer, influencing outbound traffic path preference.

**Valid values:** Integer between 0 and 65536. Optional — leave empty to use the default metric.

---

### Route Servers

**What it is:** IP addresses of route servers associated with this peer group (used at Internet Exchanges).

**Valid values:** One or more valid IPv4 or IPv6 addresses, separated by commas or newlines. Optional — leave empty if no route servers are used.

**Constraints:** All entries must be valid IP addresses. Only one separator type (comma or newline) may be used within the same input.

## Workflow Execution Steps

1. **NSO** — Creates a new IP Peer Group service model with the BGP peering configuration.
