import type { Meta } from '@storybook/react';
import { WfoPageTemplate } from './WfoPageTemplate';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React, { ReactElement } from 'react';

const Story: Meta<typeof WfoPageTemplate> = {
    component: WfoPageTemplate,
    title: 'PageTemplate/WfoPageTemplate',
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
