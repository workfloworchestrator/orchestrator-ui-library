// packages/orchestrator-ui-components/src/types.ts

/** Entity kinds in the system */
export type EntityKind = 'SUBSCRIPTION' | 'PRODUCT' | 'WORKFLOW' | 'PROCESS';

/** Subscription entity */
// export interface Subscription {
//     subscription_id: string;
//     description: string;
//     customer_id: string;
//     status:
//         | 'initial'
//         | 'active'
//         | 'migrating'
//         | 'disabled'
//         | 'terminated'
//         | 'provisioning';
//     product_id?: string | null;
//     insync: boolean;
//     note?: string | null;
//     name?: string | null;
//     end_date?: string | null;
//     start_date?: string | null;
//     version: number;
//     tag?: string | null;
//     // keep this loose so the lib doesn’t break if backend adds fields
//     [key: string]: unknown;
// }

/** Search result for subscriptions */
export interface SubscriptionSearchResult {
    score: number;
    highlight?: {
        text: string;
        indices: [number, number][];
    } | null;
    subscription: Record<string, unknown>;
}

/** Search result for processes */
export interface ProcessSearchResult {
    processId: string;
    workflowName: string;
    workflowId: string;
    status: string;
    isTask: boolean;
    createdBy?: string | null;
    startedAt: string;
    lastModifiedAt: string;
    lastStep?: string | null;
    failedReason?: string | null;
    subscriptionIds?: string[] | null;
}

/** Search result for products */
export interface ProductSearchResult {
    productId: string;
    name: string;
    productType: string;
    tag?: string | null;
    description?: string | null;
    status?: string | null;
    createdAt?: string | null;
}

/** Search result for workflows */
export interface WorkflowSearchResult {
    name: string;
    products: {
        productType: string;
        productId: string;
        name: string;
    }[];
    description?: string | null;
    createdAt?: string | null;
}

/** Union of all search results */
export type AnySearchResult =
    | SubscriptionSearchResult
    | ProcessSearchResult
    | ProductSearchResult
    | WorkflowSearchResult;

/** ---------- PathFilter & condition types ---------- */

export type DateRange = {
    from: string; // ISO date string
    to: string; // ISO date string
};

export type DateEqFilter = { op: 'eq'; value: string };
export type DateNeqFilter = { op: 'neq'; value: string };
export type DateLtFilter = { op: 'lt'; value: string };
export type DateLteFilter = { op: 'lte'; value: string };
export type DateGtFilter = { op: 'gt'; value: string };
export type DateGteFilter = { op: 'gte'; value: string };
export type DateBetweenFilter = { op: 'between'; value: DateRange };
export type DateIsNullFilter = { op: 'is_null' };
export type DateIsNotNullFilter = { op: 'is_not_null' };

export type StrEqFilter = { op: 'eq'; value: string };
export type StrNeFilter = { op: 'ne'; value: string };

export type LtreeDescendantFilter = { op: 'is_descendant'; value: string };
export type LtreeAncestorFilter = { op: 'is_ancestor'; value: string };
export type LtreeMatchesFilter = { op: 'matches_lquery'; value: string };

export type PathFilter = {
    /** Dot path to the field, e.g. "subscription.customer_id" */
    path: string;
    /** One of the supported conditions (dates, strings, or ltree ops) */
    condition:
        | DateEqFilter
        | DateNeqFilter
        | DateLtFilter
        | DateLteFilter
        | DateGtFilter
        | DateGteFilter
        | DateBetweenFilter
        | DateIsNullFilter
        | DateIsNotNullFilter
        | StrEqFilter
        | StrNeFilter
        | LtreeDescendantFilter
        | LtreeAncestorFilter
        | LtreeMatchesFilter;
};

type ActionType = 'select';

type BaseSearchParameters = {
    query?: string | null;

    filters?: PathFilter[] | null;

    action: ActionType;
};

export type SubscriptionSearchParameters = BaseSearchParameters & {
    entity_type: 'SUBSCRIPTION';
};

export type ProductSearchParameters = BaseSearchParameters & {
    entity_type: 'PRODUCT';
};

export type WorkflowSearchParameters = BaseSearchParameters & {
    entity_type: 'WORKFLOW';
};

export type ProcessSearchParameters = BaseSearchParameters & {
    entity_type: 'PROCESS';
};

export type AnySearchParameters =
    | SubscriptionSearchParameters
    | ProductSearchParameters
    | WorkflowSearchParameters
    | ProcessSearchParameters;

export type Condition = {
    path: string;
    condition: { op: string; value?: unknown };
};

export type Group = {
    op: 'AND' | 'OR';
    children: Array<Group | Condition>;
};

export type ValueSchema = {
    kind: 'string' | 'number' | 'datetime' | 'boolean' | 'object' | 'none';
    format?: string;
    fields?: Record<string, ValueSchema>;
};

// API response types (as returned by backend)
export type BackendPathInfo = {
    path: string;
    type: 'string' | 'number' | 'datetime' | 'boolean';
};

export type PathAutocompleteResponse = {
    prefix: string;
    paths: BackendPathInfo[];
};

// Enhanced type used in the frontend after enrichment
export type PathInfo = {
    path: string;
    type: 'string' | 'number' | 'datetime' | 'boolean';
    operators: string[];
    valueSchema: Record<string, ValueSchema>;
    example_values?: string[];
};

// Helper function type
export type IsConditionHelper = (item: Group | Condition) => item is Condition;
