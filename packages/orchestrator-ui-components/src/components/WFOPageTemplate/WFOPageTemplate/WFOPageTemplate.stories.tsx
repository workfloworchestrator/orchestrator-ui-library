import type { Meta } from '@storybook/react';
import { WFOPageTemplate } from './WFOPageTemplate';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React, { ReactElement } from 'react';

const Story: Meta<typeof WFOPageTemplate> = {
    component: WFOPageTemplate,
    title: 'WFOPageTemplate/WFOPageTemplate',
};
export default Story;

function getAppLogo(navigationLogo: number): ReactElement {
    return (
        <EuiFlexGroup alignItems="center" css={{ height: navigationLogo }}>
            <EuiFlexItem>FLEX ITEM PLACEHOLDER</EuiFlexItem>
        </EuiFlexGroup>
    );
}

export const Default = {
    args: {
        getAppLogo,
    },
};
