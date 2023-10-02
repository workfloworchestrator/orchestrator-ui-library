import React from 'react';
import { EuiIcon } from '@elastic/eui';

import { FieldValue } from '../../../types';

const MAX_LABEL_LENGTH = 45;

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

export function getColor(num: number) {
    if (num === 1) return 'warning';
    if (num === 2) return 'primary';
    return 'danger';
}

export const getFieldFromProductBlockInstanceValues = (
    instanceValues: FieldValue[],
    field: string,
): string | number => {
    const nameValue = instanceValues.find(
        (instanceValue) => instanceValue.field === field,
    );
    return nameValue ? nameValue.value : '';
};

export const getProductBlockTitle = (
    instanceValues: FieldValue[],
): string | number => {
    const title = getFieldFromProductBlockInstanceValues(
        instanceValues,
        'title',
    );

    if (!title) {
        return getFieldFromProductBlockInstanceValues(instanceValues, 'name');
    }

    return title && typeof title === 'string' && title.length > MAX_LABEL_LENGTH
        ? `${title.substring(0, MAX_LABEL_LENGTH)}...`
        : title;
};
