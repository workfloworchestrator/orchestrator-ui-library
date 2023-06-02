import type { Meta } from '@storybook/react';
import { EuiImage } from '@elastic/eui';
import React, { ReactElement } from 'react';
import { OrchestratorPageTemplate } from '@orchestrator-ui/orchestrator-ui-components';

const Story: Meta<typeof OrchestratorPageTemplate> = {
    component: OrchestratorPageTemplate,
    title: 'PageTemplate/OrchestratorPageTemplate',
};
export default Story;

function getAppLogo(navigationLogo: number): ReactElement {
    return (
        <EuiImage
            src="/logo-orchestrator.svg"
            alt="Orchestrator Logo"
            width={134}
            height={32}
        />
    );
}

export const Default = {
    args: {
        getAppLogo,
    },
};
