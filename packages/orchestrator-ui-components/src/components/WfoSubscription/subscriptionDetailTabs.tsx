import React from 'react';

import { WfoCogFill } from '@/icons/WfoCogFill';
import { WfoCubeSolid } from '@/icons/WfoCubeSolid';
import { WfoPlayCircle } from '@/icons/WfoPlayCircle';
import { WfoShare } from '@/icons/WfoShare';

import { WfoFilterTab } from '../WfoFilterTabs';
import { SubscriptionDetailTab } from './utils';

export const subscriptionDetailTabs: WfoFilterTab<SubscriptionDetailTab>[] = [
    {
        id: SubscriptionDetailTab.GENERAL_TAB,
        translationKey: 'general',
        prepend: <WfoCubeSolid width="18" height="18" />,
    },
    {
        id: SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB,
        translationKey: 'serviceConfiguration',
        prepend: <WfoCogFill width="18" height="18" />,
    },
    {
        id: SubscriptionDetailTab.PROCESSES_TAB,
        translationKey: 'workflows',
        prepend: <WfoPlayCircle width="18" height="18" />,
    },
    {
        id: SubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB,
        translationKey: 'relatedSubscriptions',
        prepend: <WfoShare width="18" height="18" />,
    },
];
