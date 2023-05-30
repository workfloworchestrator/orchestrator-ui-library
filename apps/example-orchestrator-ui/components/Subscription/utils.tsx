import { EuiIcon } from '@elastic/eui';
import React from 'react';

export function getColor(num: number) {
    if (num === 1) return 'warning';
    if (num === 2) return 'primary';
    return 'error';
}

export const tabs = [
    {
        id: 'general-id',
        name: 'General',
        prepend: <EuiIcon type="devToolsApp" />,
        append: <></>,
    },
    {
        id: 'service-configuration-id',
        name: 'Service configuration',
        prepend: <EuiIcon type="submodule" />,
    },
    {
        id: 'processes-id',
        name: 'Processes',
        prepend: <EuiIcon type="indexRuntime" />,
    },
    {
        id: 'related-subscriptions-id',
        disabled: true,
        name: 'Related subscriptions',
        prepend: <EuiIcon type="heatmap" />,
    },
    // {
    //     id: 'notifications-id',
    //     name: 'Notifications',
    //     append: (
    //         <EuiNotificationBadge className="eui-alignCenter" size="m">
    //             10
    //         </EuiNotificationBadge>
    //     ),
    // },
];
