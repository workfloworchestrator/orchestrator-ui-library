import React from 'react';
import { EuiStepsHorizontal, EuiStepsHorizontalProps } from '@elastic/eui';
import { useOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

// Todo DO NOT COMMIT
export function Index() {
    const { theme } = useOrchestratorTheme();
    const horizontalSteps: EuiStepsHorizontalProps['steps'] = [
        {
            // title: 'Completed step 1',
            status: 'complete',
            onClick: () => {},
        },
        {
            // title: 'Completed step 1',
            status: 'complete',
            onClick: () => {},
        },
        {
            // title: 'Completed step 1',
            status: 'complete',
            onClick: () => {},
        },
        {
            // title: 'Selected step 2',
            status: 'warning',
            onClick: () => {},
        },
        {
            // title: 'Completed step 1',
            status: 'complete',
            onClick: () => {},
        },
        {
            // title: 'Completed step 1',
            status: 'complete',
            onClick: () => {},
        },
        {
            // title: 'Completed step 1',
            status: 'loading',
            onClick: () => {},
        },
        {
            // title: 'Completed step 1',
            status: 'incomplete',
            onClick: () => {},
        },
        {
            // title: 'Incomplete step 3 which will wrap to the next line',
            onClick: () => {},
        },
        {
            // title: 'Disabled step 4',
            // status: 'disabled',
            onClick: () => {},
        },
        {
            // title: 'Incomplete step 3 which will wrap to the next line',
            onClick: () => {},
        },
        {
            // title: 'Disabled step 4',
            // status: 'disabled',
            onClick: () => {},
        },
        {
            // title: 'Incomplete step 3 which will wrap to the next line',
            onClick: () => {},
        },
        {
            // title: 'Incomplete step 3 which will wrap to the next line',
            onClick: () => {},
        },
        {
            // title: 'Incomplete step 3 which will wrap to the next line',
            onClick: () => {},
        },
    ];

    return (
        <div
            css={{
                backgroundColor: theme.colors.body,
                borderRadius: theme.border.radius.medium,
            }}
        >
            <EuiStepsHorizontal steps={horizontalSteps} size={'s'} />
        </div>
    );
}

// export function Index() {
//     return (
//         <>
//             <EuiPageHeader pageTitle="Goodmorning Hans" />
//             <EuiSpacer />
//             <WFONewProcessPanel />
//             <EuiSpacer />
//             <WFOStatCards />
//             <EuiSpacer />
//             <WFOMultiListSection />
//         </>
//     );
// }

export default Index;
