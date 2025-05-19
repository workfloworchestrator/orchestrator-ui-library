import { TranslationValues } from 'next-intl';

import { EuiThemeComputed } from '@elastic/eui';

import {
    FieldValue,
    ProcessStatus,
    SortOrder,
    SubscriptionAction,
    SubscriptionDetailProcess,
    WorkflowTarget,
} from '@/types';

export enum SubscriptionDetailTab {
    GENERAL_TAB = 'general',
    SERVICE_CONFIGURATION_TAB = 'service-configuration',
    PROCESSES_TAB = 'processes',
    RELATED_SUBSCRIPTIONS_TAB = 'related-subscriptions',
}

export const getFieldFromProductBlockInstanceValues = (
    instanceValues: FieldValue[],
    field: string,
): string | number | boolean => {
    const nameValue = instanceValues.find(
        (instanceValue) => instanceValue.field === field,
    );
    return nameValue?.value ?? '';
};

export const getProductBlockTitle = (
    instanceValues: FieldValue[],
): string | number | boolean => {
    const title = getFieldFromProductBlockInstanceValues(
        instanceValues,
        'title',
    );

    if (!title) {
        return getFieldFromProductBlockInstanceValues(instanceValues, 'name');
    }

    return title;
};

export const flattenArrayProps = (
    action: SubscriptionAction,
): TranslationValues => {
    const flatObject: TranslationValues = {};
    for (const [key, value] of Object.entries(action)) {
        if (Array.isArray(value)) {
            flatObject[key] = value.join(', ');
        } else {
            flatObject[key] = value;
        }
    }
    return action ? flatObject : {};
};

export const getWorkflowTargetColor = (
    workflowTarget: WorkflowTarget,
    theme: EuiThemeComputed,
) => {
    // Data returned from graphql can't always be depended on to be lowercase
    switch (workflowTarget.toLocaleLowerCase()) {
        case WorkflowTarget.CREATE:
            return theme.colors.successText;
        case WorkflowTarget.MODIFY:
            return theme.colors.primaryText;
        case WorkflowTarget.SYSTEM:
            return theme.colors.warning;
        case WorkflowTarget.TERMINATE:
            return theme.colors.danger;
    }

    return theme.colors.body;
};

export const getWorkflowTargetIconContent = (
    workflowTarget: WorkflowTarget,
) => {
    // Data returned from graphql can't always be depended on to be lowercase
    switch (workflowTarget.toLocaleLowerCase()) {
        case WorkflowTarget.CREATE:
            return 'C';
        case WorkflowTarget.SYSTEM:
            return 'T';
        case WorkflowTarget.TERMINATE:
            return 'X';
        default:
            return 'M';
    }
};

export const getLastUncompletedProcess = (
    processes: SubscriptionDetailProcess[],
): SubscriptionDetailProcess | undefined => {
    if (!processes || processes.length === 0) {
        return;
    }

    const uncompletedProcesses = processes
        .filter((process) => process.lastStatus !== ProcessStatus.COMPLETED)
        .sort((a, b) => {
            const dateA = new Date(a.startedAt);
            const dateB = new Date(b.startedAt);
            return dateB.getTime() - dateA.getTime();
        });

    return (uncompletedProcesses && uncompletedProcesses.length) > 0
        ? uncompletedProcesses[0]
        : undefined;
};

export const getLatestTaskDate = (processes: SubscriptionDetailProcess[]) => {
    if (!processes || processes.length === 0) {
        return '';
    }

    const tasks = processes
        .filter((process) => process.isTask)
        .sort((a, b) => {
            const dateA = new Date(a.startedAt);
            const dateB = new Date(b.startedAt);
            return dateB.getTime() - dateA.getTime();
        });

    return tasks && tasks.length > 0 ? tasks[0].startedAt : '';
};

export const sortProcessesByDate = (
    processList: SubscriptionDetailProcess[],
    sortOrder: SortOrder,
) => {
    return [...processList].sort((a, b) => {
        const dateA = new Date(a.startedAt).getTime();
        const dateB = new Date(b.startedAt).getTime();

        if (sortOrder === SortOrder.ASC) {
            return dateA - dateB; // Ascending order (oldest first)
        } else {
            return dateB - dateA; // Descending order (newest first)
        }
    });
};
