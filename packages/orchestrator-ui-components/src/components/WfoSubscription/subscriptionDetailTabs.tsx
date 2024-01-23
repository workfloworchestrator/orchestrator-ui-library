import React from 'react';

import { EuiIcon } from '@elastic/eui';

import { WfoFilterTab } from '../WfoFilterTabs';
import { SubscriptionDetailTab } from './utils';

export const subscriptionDetailTabs: WfoFilterTab<SubscriptionDetailTab>[] = [
    {
        id: SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB,
        translationKey: 'serviceConfiguration',
        prepend: <EuiIcon type="submodule" />,
    },
    {
        id: SubscriptionDetailTab.GENERAL_TAB,
        translationKey: 'general',
        prepend: <EuiIcon type="devToolsApp" />,
    },
    {
        id: SubscriptionDetailTab.PROCESSES_TAB,
        translationKey: 'workflows',
        prepend: <EuiIcon type="indexRuntime" />,
    },
    {
        id: SubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB,
        translationKey: 'relatedSubscriptions',
        prepend: <EuiIcon type="heatmap" />,
    },
];
