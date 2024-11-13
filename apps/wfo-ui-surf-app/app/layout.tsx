import Link from 'next/link';

import { OrchestratorConfig } from '@/contexts/ConfigContext';
import { AppProviders } from '@/providers/AppProviders';
import { getEnvironmentVariables } from '@/utils/getEnvironmentVariables';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Direct usage of environment variables
    const { ENVIRONMENT_NAME, ORCHESTRATOR_API_HOST, ORCHESTRATOR_API_PATH } =
        getEnvironmentVariables([
            'ENVIRONMENT_NAME',
            'ORCHESTRATOR_API_HOST',
            'ORCHESTRATOR_API_PATH',
        ]);

    console.log({
        ENVIRONMENT_NAME,
        ORCHESTRATOR_API_HOST,
        ORCHESTRATOR_API_PATH,
    });

    const initialOrchestratorConfig: OrchestratorConfig = {
        environmentName: ENVIRONMENT_NAME,
        orchestratorApiBaseUrl: `${ORCHESTRATOR_API_HOST}${ORCHESTRATOR_API_PATH}`,
    };

    console.log('Layout', { initialOrchestratorConfig });

    return (
        <html lang="en">
            <body>
                <AppProviders
                    initialOrchestratorConfig={initialOrchestratorConfig}
                >
                    <ul>
                        <li>
                            <Link href={'/'}>Home</Link>
                        </li>
                        <li>
                            <Link href={'/subpage1'}>Subpage 1</Link>
                        </li>
                        <li>
                            <Link href={'/subpage2'}>Subpage 2</Link>
                        </li>
                    </ul>
                    <div style={{ backgroundColor: 'hotpink' }}>{children}</div>
                </AppProviders>
            </body>
        </html>
    );
}
