import {
    AnySearchResult,
    Condition,
    EntityKind,
    Group,
    ProcessSearchResult,
    ProductSearchResult,
    Subscription,
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
    return 'processId' in item && 'workflowName' in item;
}

export function isProductSearchResult(
    item: AnySearchResult,
): item is ProductSearchResult {
    return 'productId' in item && 'productType' in item;
}

export function isWorkflowSearchResult(
    item: AnySearchResult,
): item is WorkflowSearchResult {
    return 'products' in item && Array.isArray(item.products);
}

export const isCondition = (item: Group | Condition): item is Condition => {
    return 'path' in item && 'condition' in item;
};

export const getExampleValues = (
    path: string,
    type: string,
): string[] | undefined => {
    const examples: Record<string, string[]> = {
        'subscription.status': [
            'active',
            'provisioning',
            'suspended',
            'terminated',
        ],
        'subscription.product.status': ['active', 'inactive'],
        'subscription.product.tag': ['IPS', 'CPE', 'VPN'],
        'subscription.product.product_type': ['IP', 'CPE', 'VPN'],
        'product.status': ['active', 'inactive'],
        'product.tag': ['IPS', 'CPE', 'VPN', 'FW'],
        'product.product_type': ['IP', 'CPE', 'VPN', 'SEC'],
        'process.last_status': ['running', 'completed', 'failed'],
        'workflow.target': ['CREATE', 'MODIFY', 'TERMINATE'],
    };

    return type === 'string' ? examples[path] : undefined;
};

export const getEndpointPath = (entityType: EntityKind): string => {
    switch (entityType) {
        case 'PROCESS':
            return 'processes';
        case 'PRODUCT':
            return 'products';
        case 'WORKFLOW':
            return 'workflows';
        case 'SUBSCRIPTION':
        default:
            return 'subscriptions';
    }
};

export const getDisplayText = (item: AnySearchResult): string => {
    if (isSubscriptionSearchResult(item)) {
        const subData = item.subscription as Subscription;
        return subData.description || 'Subscription';
    }
    if (isProcessSearchResult(item)) {
        return item.workflowName;
    }
    if (isProductSearchResult(item)) {
        return item.name;
    }
    if (isWorkflowSearchResult(item)) {
        return item.name;
    }
    return 'Unknown result type';
};

export const ENTITY_TABS = [
    { id: 'SUBSCRIPTION' as const, label: 'Subscriptions' },
    { id: 'PRODUCT' as const, label: 'Products' },
    { id: 'WORKFLOW' as const, label: 'Workflows' },
    { id: 'PROCESS' as const, label: 'Processes' },
];
