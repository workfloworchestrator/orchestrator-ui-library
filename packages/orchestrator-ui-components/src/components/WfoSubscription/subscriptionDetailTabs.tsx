import React from 'react';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { WfoFilterTab } from '@/components';
import { WfoCogFill, WfoCubeSolid, WfoPlayCircle, WfoShare } from '@/icons';

import { SubscriptionDetailTab } from './utils';

export const subscriptionDetailTabs: WfoFilterTab<SubscriptionDetailTab>[] = [
    {
        id: SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB,
        translationKey: 'serviceConfiguration',
        prepend: (
            <EuiFlexGroup justifyContent={'center'}>
                <EuiFlexItem>
                    <WfoCogFill width="16" height="16" color="currentColor" />
                </EuiFlexItem>
            </EuiFlexGroup>
        ),
    },
    {
        id: SubscriptionDetailTab.GENERAL_TAB,
        translationKey: 'general',
        prepend: (
            <EuiFlexGroup justifyContent={'center'}>
                <EuiFlexItem>
                    <WfoCubeSolid width="18" height="18" color="currentColor" />
                </EuiFlexItem>
            </EuiFlexGroup>
        ),
    },
    {
        id: SubscriptionDetailTab.PROCESSES_TAB,
        translationKey: 'workflows',
        prepend: (
            <EuiFlexGroup justifyContent={'center'}>
                <EuiFlexItem>
                    <WfoPlayCircle
                        width="18"
                        height="18"
                        color="currentColor"
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
        ),
    },
    {
        id: SubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB,
        translationKey: 'relatedSubscriptions',
        prepend: (
            <EuiFlexGroup justifyContent={'center'}>
                <EuiFlexItem>
                    <WfoShare width="16" height="16" color="currentColor" />
                </EuiFlexItem>
            </EuiFlexGroup>
        ),
    },
];
