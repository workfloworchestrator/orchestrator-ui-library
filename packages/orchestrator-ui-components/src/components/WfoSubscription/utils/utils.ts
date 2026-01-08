import { TranslationValues } from 'next-intl';

import { EuiSelectableOption, EuiThemeComputed } from '@elastic/eui';

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
            return theme.colors.textSuccess;
        case WorkflowTarget.MODIFY:
            return theme.colors.textPrimary;
        case WorkflowTarget.SYSTEM:
        case WorkflowTarget.VALIDATE:
            return theme.colors.warning;
        case WorkflowTarget.RECONCILE:
            return theme.colors.accent;
        case WorkflowTarget.TERMINATE:
            return theme.colors.danger;
    }

    return theme.colors.backgroundBasePlain;
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

const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const extractUUIDsFromBrackets = (input: string) => {
    const start = input.indexOf('[');
    const end = input.indexOf(']', start);
    if (start === -1 || end === -1) return [];
    const content = input.slice(start + 1, end).trim();
    if (!content) return [];

    return content
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, '')) // remove surrounding ' or "
        .filter((s) => uuidRegex.test(s));
};

export function parseErrorDetail(errorDetail: string) {
    const failedIds = extractUUIDsFromBrackets(errorDetail);
    const filteredInput = errorDetail.split('[')[0].trim();
    return { failedIds, filteredInput };
}

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
