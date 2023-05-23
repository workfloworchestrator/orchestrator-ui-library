import { QueryClient, QueryClientProvider } from "react-query";
import { EuiProvider } from "@elastic/eui";
import { defaultOrchestratorTheme } from '../src/lib/theme/defaultOrchestratorTheme';
import { OrchestratorConfigProvider } from '../src/lib/contexts/OrchestratorConfigContext';

import '@elastic/eui/dist/eui_theme_light.min.css';

const queryClient = new QueryClient();

const initialOrchestratorConfig = {
    orchestratorApiBaseUrl: "https://testing.test/",
    engineStatusEndpoint: "https://testing.test/settings/status",
    processStatusCountsEndpoint: "https://testing.test/processes/status-counts",
    graphqlEndpoint: "https://testing.test/graphql",
    environmentName: "development",
};

function withContext(Story) {
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

export const decorators = [withContext];