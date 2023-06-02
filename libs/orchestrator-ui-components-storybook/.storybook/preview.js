import { QueryClient, QueryClientProvider } from "react-query";
import { EuiProvider } from "@elastic/eui";
import { defaultOrchestratorTheme, OrchestratorConfigProvider } from '@orchestrator-ui/orchestrator-ui-components';

import '@elastic/eui/dist/eui_theme_light.min.css';

const queryClient = new QueryClient();

const initialOrchestratorConfig = {
    orchestratorApiBaseUrl: "https://testing.test/",
    engineStatusEndpoint: "https://testing.test/settings/status",
    processStatusCountsEndpoint: "https://testing.test/processes/status-counts",
    graphqlEndpoint: "https://testing.test/graphql",
    environmentName: "development",
};


const withContext = (Story) => {
  return (
    <EuiProvider colorMode="light" modify={defaultOrchestratorTheme}>
      <main className="app">
        <OrchestratorConfigProvider initialOrchestratorConfig={initialOrchestratorConfig} >
          <QueryClientProvider client={queryClient}>
              <Story />
          </QueryClientProvider>
        </OrchestratorConfigProvider>
      </main>
    </EuiProvider>
  );
}

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withContext]
};

export default preview;
