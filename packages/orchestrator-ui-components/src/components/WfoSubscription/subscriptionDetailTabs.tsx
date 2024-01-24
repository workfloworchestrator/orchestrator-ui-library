import React from 'react';

import { WfoFilterTab } from '@/components';
import { WfoCogFill } from '@/icons/WfoCogFill';
import { WfoCubeSolid } from '@/icons/WfoCubeSolid';
import { WfoPlayCircle } from '@/icons/WfoPlayCircle';
import { WfoShare } from '@/icons/WfoShare';

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
            />
        ),
    },
    {
        id: SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB,
        translationKey: 'serviceConfiguration',
        prepend: (
            <WfoCogFill width="18" height="18" xPosition="-2" yPosition="-2" />
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
            />
        ),
    },
    {
        id: SubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB,
        translationKey: 'relatedSubscriptions',
        prepend: <WfoShare width="18" height="18" />,
    },
];
