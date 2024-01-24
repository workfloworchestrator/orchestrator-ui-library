import React from 'react';

import { WfoFilterTab } from '@/components';
import { WfoCogFill, WfoCubeSolid, WfoPlayCircle, WfoShare } from '@/icons';

import { SubscriptionDetailTab } from './utils';

export const subscriptionDetailTabs: WfoFilterTab<SubscriptionDetailTab>[] = [
    {
        id: SubscriptionDetailTab.GENERAL_TAB,
        translationKey: 'general',
        prepend: (
            <WfoCubeSolid
                width="18"
                height="18"
                xPosition={-1}
                yPosition={-1}
                color="currentColor"
            />
        ),
    },
    {
        id: SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB,
        translationKey: 'serviceConfiguration',
        prepend: (
            <WfoCogFill
                width="18"
                height="18"
                xPosition="-2"
                yPosition="-2"
                color="currentColor"
            />
        ),
    },
    {
        id: SubscriptionDetailTab.PROCESSES_TAB,
        translationKey: 'workflows',
        prepend: (
            <WfoPlayCircle
                width="18"
                height="18"
                xPosition="-1"
                yPosition="-1"
                color="currentColor"
            />
        ),
    },
    {
        id: SubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB,
        translationKey: 'relatedSubscriptions',
        prepend: <WfoShare width="18" height="18" color="currentColor" />,
    },
];
