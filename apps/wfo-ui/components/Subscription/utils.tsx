import { EuiIcon } from '@elastic/eui';
import React from 'react';

export function getColor(num: number) {
    if (num === 1) return 'warning';
    if (num === 2) return 'primary';
    return 'error';
}

export const GENERAL_TAB = 'general-id';
export const SERVICE_CONFIGURATION_TAB = 'service-configuration-id';
export const PROCESSES_TAB = 'processes-id';
export const RELATED_SUBSCRIPTIONS_TAB = 'related-subscriptions-id';

export const tabs = [
    {
        id: GENERAL_TAB,
        translationKey: 'tabs.general',
        prepend: <EuiIcon type="devToolsApp" />,
        append: <></>,
    },
    {
        id: SERVICE_CONFIGURATION_TAB,
        translationKey: 'tabs.serviceConfiguration',
        prepend: <EuiIcon type="submodule" />,
    },
    {
        id: PROCESSES_TAB,
        translationKey: 'tabs.processes',
        prepend: <EuiIcon type="indexRuntime" />,
    },
    {
        id: RELATED_SUBSCRIPTIONS_TAB,
        disabled: true,
        translationKey: 'tabs.relatedSubscriptions',
        prepend: <EuiIcon type="heatmap" />,
    },
];
