import {
    AnySearchResult,
    Condition,
    EntityKind,
    Group,
    PathInfo,
    ProcessSearchResult,
    ProductSearchResult,
    SubscriptionSearchResult,
    WorkflowSearchResult,
} from '@/types';

export function isSubscriptionSearchResult(
    item: AnySearchResult,
): item is SubscriptionSearchResult {
    return 'subscription' in item && typeof item.subscription === 'object';
}

export function isProcessSearchResult(
    item: AnySearchResult,
): item is ProcessSearchResult {
    return 'process' in item && typeof item.process === 'object';
}

export function isProductSearchResult(
    item: AnySearchResult,
): item is ProductSearchResult {
    return 'product' in item && typeof item.product === 'object';
}

export function isWorkflowSearchResult(
    item: AnySearchResult,
): item is WorkflowSearchResult {
    return 'workflow' in item && typeof item.workflow === 'object';
}

export const isCondition = (item: Group | Condition): item is Condition => {
    return 'path' in item && 'condition' in item;
};

const ENDPOINT_PATHS: Record<EntityKind, string> = {
    PROCESS: 'processes',
    PRODUCT: 'products',
    WORKFLOW: 'workflows',
    SUBSCRIPTION: 'subscriptions',
};

export const getEndpointPath = (entityType: EntityKind): string => {
    return ENDPOINT_PATHS[entityType] || ENDPOINT_PATHS.SUBSCRIPTION;
};

export const getDisplayText = (item: AnySearchResult): string => {
    if (isSubscriptionSearchResult(item)) {
        return item.subscription.description || 'Subscription';
    }
    if (isProcessSearchResult(item)) {
        return item.process.workflowName;
    }
    if (isProductSearchResult(item)) {
        return item.product.name;
    }
    if (isWorkflowSearchResult(item)) {
        return item.workflow.name;
    }
    return 'Unknown result type';
};

export const getRecordId = (result: AnySearchResult): string => {
    if (isSubscriptionSearchResult(result)) {
        return result.subscription.subscription_id;
    }
    if (isProductSearchResult(result)) {
        return result.product.product_id;
    }
    if (isProcessSearchResult(result)) {
        return result.process.processId;
    }
    if (isWorkflowSearchResult(result)) {
        return result.workflow.name;
    }
    return '';
};

export const findResultIndexById = (
    results: AnySearchResult[],
    recordId: string,
): number => {
    return results.findIndex((result) => {
        if (isSubscriptionSearchResult(result)) {
            return result.subscription.subscription_id === recordId;
        }
        if (isProductSearchResult(result)) {
            return result.product.product_id === recordId;
        }
        if (isProcessSearchResult(result)) {
            return result.process.processId === recordId;
        }
        if (isWorkflowSearchResult(result)) {
            return result.workflow.name === recordId;
        }
        return false;
    });
};

export const getDetailUrl = (
    result: AnySearchResult,
    baseUrl: string,
): string => {
    if (isSubscriptionSearchResult(result)) {
        return `${baseUrl}/subscriptions/${result.subscription.subscription_id}`;
    }
    if (isProductSearchResult(result)) {
        return `${baseUrl}/products/${result.product.product_id}`;
    }
    if (isProcessSearchResult(result)) {
        return `${baseUrl}/processes/${result.process.processId}`;
    }
    if (isWorkflowSearchResult(result)) {
        return `${baseUrl}/workflows/${result.workflow.name}`;
    }
    return '#';
};

export const getDescription = (result: AnySearchResult): string => {
    if (isSubscriptionSearchResult(result)) {
        return result.subscription.description;
    }
    if (isProductSearchResult(result)) {
        return result.product.description || result.product.name;
    }
    if (isWorkflowSearchResult(result)) {
        return result.workflow.description || result.workflow.name;
    }
    if (isProcessSearchResult(result)) {
        return result.process.workflowName;
    }
    return 'Unknown';
};

export const ENTITY_TABS = [
    { id: 'SUBSCRIPTION' as const, label: 'Subscriptions' },
    { id: 'PRODUCT' as const, label: 'Products' },
    { id: 'WORKFLOW' as const, label: 'Workflows' },
    { id: 'PROCESS' as const, label: 'Processes' },
];

interface ThemeColors {
    success: string;
    primary: string;
    warning: string;
    accent: string;
    textSubdued: string;
}

interface Theme {
    colors: ThemeColors;
}

const TYPE_COLOR_MAP: Record<string, keyof ThemeColors> = {
    string: 'success',
    number: 'primary',
    boolean: 'warning',
    datetime: 'accent',
    component: 'primary',
};

export const getTypeColor = (type: string, theme: Theme): string => {
    const colorKey = TYPE_COLOR_MAP[type.toLowerCase()];
    return colorKey ? theme.colors[colorKey] : theme.colors.textSubdued;
};

interface OperatorDisplay {
    symbol: string;
    description: string;
}

const OPERATOR_MAP: Record<string, OperatorDisplay> = {
    eq: { symbol: '=', description: 'equals' },
    neq: { symbol: '≠', description: 'not equals' },
    lt: { symbol: '<', description: 'less than' },
    lte: { symbol: '≤', description: 'less than or equal to' },
    gt: { symbol: '>', description: 'greater than' },
    gte: { symbol: '≥', description: 'greater than or equal to' },
    between: { symbol: '⟷', description: 'between (range)' },
    has_component: { symbol: '✓', description: 'has component' },
    not_has_component: { symbol: '✗', description: 'does not have component' },
};

const BOOLEAN_OPERATOR_MAP: Record<string, OperatorDisplay> = {
    eq: { symbol: '✓', description: 'is true' },
    neq: { symbol: '✗', description: 'is false' },
};

export const getOperatorDisplay = (
    op: string,
    selectedPathInfo?: PathInfo,
): OperatorDisplay => {
    if (selectedPathInfo?.type === 'boolean' && BOOLEAN_OPERATOR_MAP[op]) {
        return BOOLEAN_OPERATOR_MAP[op];
    }
    return OPERATOR_MAP[op] || { symbol: op, description: op };
};

export const getButtonColor = (
    op: string,
    pathInfo: PathInfo | null,
    condition: Condition,
): 'primary' | 'text' => {
    if (pathInfo?.type === 'boolean') {
        const isSelected =
            op === 'eq'
                ? condition.condition.value === true
                : condition.condition.value === false;
        return isSelected ? 'primary' : 'text';
    }
    return condition.condition.op === op ? 'primary' : 'text';
};

export const getButtonFill = (
    op: string,
    pathInfo: PathInfo | null,
    condition: Condition,
): boolean => {
    if (pathInfo?.type === 'boolean') {
        return op === 'eq'
            ? condition.condition.value === true
            : condition.condition.value === false;
    }
    return condition.condition.op === op;
};

export const isFilterValid = (group: Group): boolean => {
    return group.children.every((child) => {
        if (isCondition(child)) {
            return (
                child.path &&
                child.condition.op &&
                child.condition.value !== undefined
            );
        }
        return isFilterValid(child);
    });
};

interface SearchQuery {
    text?: string;
}

export const buildSearchParams = (
    debouncedQuery: SearchQuery | string,
    selectedEntityTab: EntityKind,
    filterGroup: Group,
    pageSize: number,
) => {
    const queryText =
        typeof debouncedQuery === 'string'
            ? debouncedQuery
            : debouncedQuery?.text?.trim() || '';

    return {
        action: 'select' as const,
        entity_type: selectedEntityTab,
        query: queryText || undefined,
        filters: filterGroup?.children.length > 0 ? filterGroup : undefined,
        limit: pageSize,
    };
};
