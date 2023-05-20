import { EuiIcon, EuiNotificationBadge } from '@elastic/eui';
import React from 'react';

export function getColor(num: number) {
    if (num === 1) return 'warning';
    if (num === 2) return 'primary';
    if (num === 3) return 'success';
    return 'error';
}

export function getTokenName(name: string) {
    const icons = {
        Node: 'tokenNamespace',
        'IP BGP Service Settings': 'tokenEnumMember',
        IP_PREFIX: 'tokenIP',
    };
    if (name in icons) {
        return icons[name];
    }
    return 'tokenConstant';
}

export const tabs = [
    {
        id: 'general-id',
        name: 'General',
        prepend: <EuiIcon type="devToolsApp" />,
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
