import {
    SearchResult,
    Condition,
    EntityKind,
    Group,
} from '@/types';

export function isSubscriptionSearchResult(
    item: SearchResult,
): boolean {
    return item.entity_type === 'SUBSCRIPTION';
}

export function isProcessSearchResult(
    item: SearchResult,
): boolean {
    return item.entity_type === 'PROCESS';
}

export function isProductSearchResult(
    item: SearchResult,
): boolean {
    return item.entity_type === 'PRODUCT';
}

export function isWorkflowSearchResult(
    item: SearchResult,
): boolean {
    return item.entity_type === 'WORKFLOW';
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

export const getDetailUrl = (
    result: SearchResult,
    baseUrl: string,
): string => {
    const endpointPath = getEndpointPath(result.entity_type);
    return `${baseUrl}/${endpointPath}/${result.entity_id}`;
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

interface PathInfo {
    type?: string;
    [key: string]: unknown;
}

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
        query: queryText || '',
        filters: filterGroup?.children.length > 0 ? filterGroup : undefined,
        limit: pageSize,
    };
};
