import { _EuiThemeColorsMode } from '@elastic/eui/src/global_styling/variables/colors';

export type Nullable<T> = T | null;

type GenericField = { [key: string]: number | string | boolean };

export type EngineStatusValue = 'RUNNING' | 'PAUSING' | 'PAUSED';

export type CustomerBase = {
    name: string;
    abbreviation?: string;
} & GenericField;

export type ProductBase = {
    name: string;
    description: string;
    status: string;
    tag: string;
    type: string;
    createdAt: string;
    endDate?: string | null;
} & GenericField;

export type ResourceTypeBase = {
    name: string;
    title: string;
    subscriptionInstanceId: string;
    ownerSubscriptionId: string;
    label?: string;
} & GenericField;

export type ProductBlockBase = {
    id: number;
    ownerSubscriptionId: string;
    parent: Nullable<number>;
    resourceTypes: ResourceTypeBase;
};

export type FixedInputsBase = GenericField;

export type ExternalServiceBase = {
    externalServiceKey: string;
    externalServiceId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    externalServiceData: any;
} & GenericField;

export type SubscriptionDetailBase = {
    // Top level subscription fields
    subscriptionId: string;
    description: string;
    customerId?: string | null;
    insync: boolean;
    status: string;
    startDate?: string | null;
    endDate?: string | null;
    note?: string;

    // Nested attributes
    product: ProductBase;
    fixedInputs: FixedInputsBase;
    customer?: CustomerBase;
    productBlocks: ProductBlockBase[];

    externalServices?: ExternalServiceBase[];
};

export interface TreeBlock extends ProductBlockBase {
    icon: string;
    label: string;
    callback: () => void;
    children: TreeBlock[];
}

export interface ItemsList {
    type: string;
    title: string;
    items: Process[];
    buttonName: string;
}

export interface TotalStat {
    icon: string;
    name: string;
    value: number;
    color: keyof _EuiThemeColorsMode;
}

export interface Process {
    pid: string;
    workflow: string;
    assignee: string;
    last_status: string;
    failed_reason: Nullable<string>;
    traceback: string;
    step: string;
    created_by: string;
    started_at: number;
    last_modified_at: number;
    is_task: boolean;
}

export interface ProductTEMP {
    name: string;
    tag: string;
    description: string;
    product_id: string;
    created_at: number;
    product_type: string;
    end_date: number;
    status: string;
    fixed_inputs: [];
    workflows: [];
    product_blocks: [];
    create_subscription_workflow_key: string;
    modify_subscription_workflow_key: string;
    terminate_subscription_workflow_key: string;
}

//// Utility types

export interface GraphQlResultPageInfo {
    totalItems: string;
    startCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    endCursor: string;
}

export interface Product {
    name: string;
    description: string;
    tag: string;
    productType: string;
    status: string;
    productBlocks: ProductBlock[];
    createdAt: string;
}

interface ProductBlock {
    name: string;
}

export type Field<Type> = keyof Type;

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type GraphQLSort<Type> = {
    field: keyof Type;
    order: SortOrder;
};

export type GraphqlFilter<Type> = {
    field: keyof Type;
    value: string;
};

export type GraphqlQueryVariables<Type> = {
    first: number;
    after: number;
    sortBy?: GraphQLSort<Type>;
    filterBy?: GraphqlFilter<Type>[];
};
