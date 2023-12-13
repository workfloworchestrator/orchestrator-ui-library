import React from 'react';

import { EuiIcon } from '@elastic/eui';

import { WfoFilterTab } from '../WfoFilterTabs';
import { WfoSubscriptionDetailTab } from './utils';

export const subscriptionDetailTabs: WfoFilterTab<WfoSubscriptionDetailTab>[] =
    [
        {
            id: WfoSubscriptionDetailTab.GENERAL_TAB,
            translationKey: 'general',
            prepend: <EuiIcon type="devToolsApp" />,
        },
        {
            id: WfoSubscriptionDetailTab.SERVICE_CONFIGURATION_TAB,
            translationKey: 'serviceConfiguration',
            prepend: <EuiIcon type="submodule" />,
        },
        {
            id: WfoSubscriptionDetailTab.PROCESSES_TAB,
            translationKey: 'workflows',
            prepend: <EuiIcon type="indexRuntime" />,
        },
        {
            id: WfoSubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB,
            translationKey: 'relatedSubscriptions',
            prepend: <EuiIcon type="heatmap" />,
        },
    ];
