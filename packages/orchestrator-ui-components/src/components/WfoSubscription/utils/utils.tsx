import React from 'react';

import { TranslationValues } from 'next-intl';
import Link from 'next/link';

import { EuiSelectableOption, EuiThemeComputed } from '@elastic/eui';

import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import {
    FieldValue,
    ProcessStatus,
    ProductBlockDefinition,
    ProductBlockInstance,
    SortOrder,
    SubscriptionAction,
    SubscriptionDetailProcess,
    WorkflowTarget,
} from '@/types';

const PRODUCT_BLOCK_NAME_FIELD: keyof ProductBlockDefinition = 'name';

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
        case WorkflowTarget.VALIDATE:
            return theme.colors.warning;
        case WorkflowTarget.RECONCILE:
            return theme.colors.accent;
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
        case WorkflowTarget.VALIDATE:
            return 'T';
        case WorkflowTarget.TERMINATE:
            return 'X';
        case WorkflowTarget.RECONCILE:
            return 'R';
        default:
            return 'M';
    }
};

export const getLastUncompletedProcess = (
    processes?: SubscriptionDetailProcess[],
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

// export const getFailedProcesses = (processes?: SubscriptionDetailProcess[]) => processes?.filter(
//     (process) => process.lastStatus.toLowerCase() === ProcessStatus.FAILED,
// );

export const getErrorToastMessage = (errorDetail: string) => {
    console.log('getErrorToastMessage errorDetail', errorDetail);
    // console.log("getErrorToastMessage failedProcesses", failedProcesses);
    // if (!failedProcesses || failedProcesses.length === 0) {
    //     return errorDetail;
    // }
    const failedIds =
        errorDetail.match(/\[([^\]]+)\]/)?.[1].match(/[0-9a-f-]{36}/g) || [];
    // const parts = errorDetail.split(/\[[^\]]+\]/);
    const filteredInput = errorDetail.replace(/\[.*\]/, '').trim();

    return (
        <div css={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            <div>{filteredInput}</div>
            {failedIds.map((processId) => {
                const processUrl = `${PATH_WORKFLOWS}/${processId}`;
                return (
                    <div key={processId}>
                        <Link href={processUrl}>{processId}</Link>
                    </div>
                );
            })}
        </div>
    );
};

export const getLatestTaskDate = (processes?: SubscriptionDetailProcess[]) => {
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

    return tasks.length > 0 ? tasks[0].startedAt : '';
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

export const mapProductBlockInstancesToEuiSelectableOptions = (
    productBlockInstances: ProductBlockInstance[],
): EuiSelectableOption[] => {
    const items2Map = productBlockInstances.reduce((acc, curr) => {
        const name = getFieldFromProductBlockInstanceValues(
            curr.productBlockInstanceValues,
            PRODUCT_BLOCK_NAME_FIELD,
        ).toString();

        if (!name) {
            console.error('Name field is missing', curr);
        }

        if (acc.has(name)) {
            acc.get(name)?.push(curr.id);
        } else {
            acc.set(name, [curr.id]);
        }

        return acc;
    }, new Map<string, number[]>());

    return Array.from(items2Map).map(([label, ids]) => ({
        label,
        data: {
            ids,
        },
    }));
};
