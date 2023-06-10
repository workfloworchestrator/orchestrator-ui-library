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
        name: 'General',
        prepend: <EuiIcon type="devToolsApp" />,
        append: <></>,
    },
    {
        id: SERVICE_CONFIGURATION_TAB,
        name: 'Service configuration',
        prepend: <EuiIcon type="submodule" />,
    },
    {
        id: PROCESSES_TAB,
        name: 'Processes',
        prepend: <EuiIcon type="indexRuntime" />,
    },
    {
        id: RELATED_SUBSCRIPTIONS_TAB,
        disabled: true,
        name: 'Related subscriptions',
        prepend: <EuiIcon type="heatmap" />,
    },
];
