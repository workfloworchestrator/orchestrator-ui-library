# Complete flow for working set up with this frontend

core package: git clone `https://github.com/workfloworchestrator/orchestrator-core`

backend: git clone: `https://github.com/workfloworchestrator/example-orchestrator`

1. Create .env in backend root (example-orchestrator): with: CORE_DIR=../orchestrator-core (or absolute path to the core package)

2. Add `OPENAI_API_KEY` to `orchestrator.env`

3. in docker-compose, replace image with image: "pgvector/pgvector:pg14"

4. run `docker compose up --build orchestrator`

5. Verify logs say: `Use editable install of orchestrator-core with dev and test dependencies` , after running step 2.

6. Verify api is running:

```bash
curl -v http://localhost:8080/api/products/
```

or go to `http://localhost:8080/api/docs/`

7. git clone private repo for frontend, follow steps below for Orchetrator UI library:

8. switch to branch: pr-2123

Note: Skip agent page for now as it has conflicting packages, focus on search page.

# Orchestrator ui library

This repo contains the generally reusable parts of the orchestrator ui grouped and exposed as pages, components and elements such as icons.
It is meant to be used together with an app that includes this library through NPM. For ease of development we have added the orchestrator example app implementation as a submodule in the folder /aps/wfo-ui.

To install and run the app:

```
git clone git@github.com:timfdev/orchestrator_ui_private.git
cd orchestrator_ui_private
git checkout pr-2123
git submodule init
git submodule update
# Optionally: to update to the latest version of the git submodule instead of the ones currently pinned to the repo run
git submodule update --remote
cp apps/wfo-ui/.env.example apps/wfo-iu/.env
# change the values in the env file to point to your orchestrator backend
# set auth=false or follow the directions below this sections
npm install
npm run dev
```

Set `OAUTH2_ACTIVE`=False

This makes the orchestrator ui run on http://localhost:3000

We will work on branch pr-2123, there is already a PR open.

# Inside apps/wfo-ui

We still need the new pages for search/agent as well as route.

Create app/wfo/pages/api/copilotkit.ts with:

```typescript
import { HttpAgent } from '@ag-ui/client';
import { CopilotRuntime, ExperimentalEmptyAdapter, config as copilotConfig, copilotRuntimeNextJSPagesRouterEndpoint } from '@copilotkit/runtime';

export const config = copilotConfig;

const runtime = new CopilotRuntime({
    agents: {
        query_agent: new HttpAgent({
            url: process.env.AGENT_URL || 'http://localhost:8080/agent/',
        }),
    },
});

const serviceAdapter = new ExperimentalEmptyAdapter();

export default copilotRuntimeNextJSPagesRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
});
```

Create apps/wfo-ui/pages/agent.tsx:

```typescript
import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import { WfoAgent } from '@orchestrator-ui/orchestrator-ui-components';

export default function SearchPage() {
    return (
        <CopilotKit runtimeUrl="/api/copilotkit" agent="query_agent">
            <WfoAgent />
        </CopilotKit>
    );
}

```

Create apps/wfo-ui/pages/search.tsx:

```typescript
import { WfoSearch } from '@orchestrator-ui/orchestrator-ui-components';

export default function SearchPage() {
    return <WfoSearch />;
}

```

Add them to apps/wfo-ui/pages/\_app.tsx

```typescript
        {
            name: 'Search',
            id: '10',
            isSelected: router.pathname === '/search',
            href: '/search',
            renderItem: () => (
                <WfoMenuItemLink
                    path={'/search'}
                    translationString="Search"
                    isSelected={router.pathname === '/search'}
                />
            ),
        },
        {
            name: 'Agent',
            id: '10',
            isSelected: router.pathname === '/agent',
            href: '/agent',
            renderItem: () => (
                <WfoMenuItemLink
                    path={'/agent'}
                    translationString="Agent"
                    isSelected={router.pathname === '/agent'}
                />
            ),
        },
```

# Data

For some seed data , just import the dump that includes a few records and embeddings.
