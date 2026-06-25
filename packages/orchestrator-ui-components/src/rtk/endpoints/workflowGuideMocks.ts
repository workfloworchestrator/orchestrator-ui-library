/**
 * TEMPORARY MOCK DATA for the workflow/task user-guide feature.
 *
 * These are inlined copies of the markdown files in the library's `workflow-guides/`
 * folder, keyed by workflow/task name. They exist only so the mock RTK endpoint
 * (`getWorkflowGuide`) can return guide content without a backend.
 *
 * Once the real endpoint `GET /api/workflow-guides/{workflow_name}` is available,
 * delete this file and replace the `queryFn` in `workflowGuides.ts` with a `query`
 * that hits the API (the backend reads the same markdown from WORKFLOW_GUIDE_DIR).
 */

const createIpPeerGroupGuide = `# Create IP Peer Group

Creates a new IP Peer Group subscription and provisions it in NSO. Use this workflow to set up BGP peering configuration for a research or commercial network partner.

## Fields

### Ticket ID

**What it is:** Reference to the Jira ticket that tracks this change request.

**Valid values:** A valid Jira ticket ID, e.g. \`IPAM-1234\`. Leave empty if no ticket applies.

**Constraints:** Optional. When provided, must match the Jira ticket ID format.

---

### Peer Group Name

**What it is:** A unique identifier for this peer group, used as the service name in NSO and the subscription description.

**Valid values:** Letters, digits, and hyphens only. Example: \`AMS-IX-Research\`.

**Constraints:** Must be unique across all IP Peer Group subscriptions. No spaces or special characters.

---

### Peer Type

**What it is:** Classifies the network type of the peering partner, which determines the applicable routing policy.

**Valid values:**
- \`research-network\` — Research and education network partner
- \`commercial-network\` — Commercial network partner

---

### Interconnection Type

**What it is:** The physical or logical interconnection method used to reach the peer.

**Valid values:**
- \`ix\` — Internet Exchange Point
- \`pni\` — Private Network Interconnect (direct peering)
- \`transit\` — Transit provider

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
`;

const modifyL2vpnGuide = `# Modify L2VPN

Modifies the configuration of an existing Layer 2 VPN service. Use this workflow to change service ports, VLAN assignments, speed settings, or the attached firewall endpoint.

## Fields

### Contact Persons

**What it is:** The contact persons at the customer organisation associated with this subscription. They will receive the confirmation email when the workflow completes.

**Valid values:** One or more persons selected from the customer's CRM contacts.

**Constraints:** Optional. Defaults to the existing contact persons on the subscription.

---

### Ticket ID

**What it is:** Reference to the Jira ticket that tracks this change request.

**Valid values:** A valid Jira ticket ID, e.g. \`IPAM-1234\`. Leave empty if no ticket applies.

**Constraints:** Optional. When provided, must match the Jira ticket ID format.

---

### ESI Service Ports

**What it is:** The Ethernet Segment Identifiers (ESIs) that make up this L2VPN. Each ESI contains one or more service ports, each with a VLAN assignment. This defines which ports are connected to the L2VPN and how they are tagged.

**Valid values:** One or more ESIs, each containing at least one service port with a VLAN range.

**Constraints:**
- Each service port subscription may only appear once across all ESIs.
- When VLAN Retagging is disabled, all service ports within an ESI must use identical VLAN ranges.
- When VLAN Retagging is enabled, each port within an ESI must use a single VLAN ID (not a range).

---

### L2 Firewall Endpoint

**What it is:** An optional firewall L2 endpoint to attach to this L2VPN, enabling traffic inspection between the VPN endpoints.

**Valid values:** One of the available FW L2 endpoints, or empty to detach any existing firewall endpoint.

**Constraints:** Only shown when firewall L2 endpoints are available. VLAN Retagging must be enabled when a firewall endpoint is selected.

---

### Service Speed

**What it is:** The maximum bandwidth for this L2VPN service, in Mbit/s.

**Valid values:** Integer between 1 and 400,000 (Mbit/s).

---

### Speed Policer

**What it is:** Enables or disables the speed policer, which enforces the configured service speed on the network device.

**Valid values:** Enabled or disabled (checkbox).

---

### VLAN Retagging

**What it is:** When enabled, the network rewrites VLAN tags between the endpoints of the L2VPN, allowing each side to use a different VLAN ID for the same service.

**Valid values:** Enabled or disabled (checkbox).

**Constraints:** Must be enabled when a Firewall L2 endpoint is attached. Cannot be enabled when any service port uses a VLAN range (as opposed to a single VLAN ID).

---

### BUM Filter

**What it is:** Enables or disables filtering of BUM traffic (Broadcast, Unknown unicast, Multicast) on this L2VPN. When enabled, this traffic is suppressed to reduce unnecessary load on the network.

**Valid values:** Enabled or disabled (checkbox).

---

### Interface MAC/IP Limit

**What it is:** The maximum number of MAC and IP address entries allowed per interface on this L2VPN. This limits the size of the MAC/IP table to prevent resource exhaustion.

**Valid values:** Integer between 1,024 and 131,071.

## Field Dependencies

- **L2 Firewall Endpoint** is only available when firewall L2 endpoints exist in the system.
- **VLAN Retagging** must be enabled when **L2 Firewall Endpoint** is set.
- When **VLAN Retagging** is disabled, all service ports in each ESI must use identical VLAN ranges.

## Workflow Execution Steps

1. **IMS** — Updates the existing L2VPN circuit with the new configuration (speed, ports, VLAN assignments).
2. **NSO** — Applies the updated L2VPN service model to the network devices.
3. **Email** — Sends a confirmation email to the listed contact persons.
`;

export const workflowGuideMocks: Record<string, string> = {
  create_ip_peer_group: createIpPeerGroupGuide,
  modify_l2vpn: modifyL2vpnGuide,
};
