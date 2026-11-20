# Agent chat configuration

The Orchestrator UI can show the Orchestrator Agent as a chat popup on every page. This integration is
available in `@orchestrator-ui/orchestrator-ui-components` from version 11.0.0.

## Enable the popup

Set `orchestratorAgentUrl` in the `OrchestratorConfig` your application supplies:

```ts
return {
    // Your existing OrchestratorConfig settings
    orchestratorAgentUrl: '/agui/',
};
```

The setting is an optional string. Leaving it unset or empty hides the popup. Set it to the agent's AG-UI
route as the browser reaches it, including the trailing slash. It is not the agent's base URL or a
container hostname visible only to your server.

The UI passes the signed-in person's session access token to the popup and applies the current UI theme,
including your theme overrides. Your application does not need to render a separate `WfoChat` component.

## Route browser requests to the agent

With the standard agent configuration, use a proxy on the UI's own origin. The agent does not enable
CORS by default. For `orchestratorAgentUrl: '/agui/'`, forward both `/agui/` and `/chats` to the agent.
The popup uses `/agui/` for streamed replies and `/chats` for history, form options and export downloads.

If you use a path prefix, preserve it for both routes: for example, `/api/agent/agui/` pairs with
`/api/agent/chats`. Configure the proxy to strip that prefix before forwarding requests to the agent.
Disable response buffering for the AG-UI route so replies stream as the agent works.

See the [agent chat setup guide](https://github.com/workfloworchestrator/orchestrator-agent/blob/main/docs/guides/chat-popup.md#proxy-setup)
for Vite and nginx examples and the agent's authentication requirements. The agent must accept the
session token issued by your UI's identity provider.

## Read the URL from your environment

The library reads `OrchestratorConfig`; it does not read an `ORCHESTRATOR_AGENT_URL` environment variable
itself. If you use that name, read it in your application's configuration function and assign its value
to `orchestratorAgentUrl`. The variable name and how it reaches browser configuration belong to your app.

For a complete deployment example, follow the
[example orchestrator tutorial](https://workfloworchestrator.org/learn/orchestrator-agent/tutorials/example-orchestrator/#part-4-explore-the-agent-inside-the-wfo-ui).

## Check the configuration

- With the setting empty, the chat button is hidden.
- With the setting configured, the chat button appears on every page.
- A 404 for history or downloads usually means the `/chats` proxy route is missing.
- A CORS error usually means the browser is reaching another origin instead of your proxy.
- A 401 means the token is missing, expired or not accepted by the agent.

The chat package's [README](https://github.com/workfloworchestrator/orchestrator-agent-chat#readme) documents
the underlying component's props. Use the agent guide for full setup steps.
