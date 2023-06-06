import type { Meta } from '@storybook/react';
import { OrchestratorPageTemplate } from './OrchestratorPageTemplate';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React, { ReactElement } from 'react';
import Logo from '../../../../../.storybook/mockdata/logo-orchestrator.svg';

const Story: Meta<typeof OrchestratorPageTemplate> = {
    component: OrchestratorPageTemplate,
    title: 'PageTemplate/OrchestratorPageTemplate',
};
export default Story;

function getAppLogo(navigationLogo: number): ReactElement {
    return (
        <EuiFlexGroup alignItems="center" css={{ height: navigationLogo }}>
            <EuiFlexItem>
                <img
                    src={Logo}
                    alt="Orchestrator Logo"
                    width={134}
                    height={32}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
}

export const Default = {
    args: {
        getAppLogo,
    },
};
