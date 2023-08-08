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

export interface ResourceTypeDefinition {
    description: string;
    resourceType: string;
    resourceTypeId: string;
}

export interface ProductBlockDefinition {
    productBlockId: string;
    name: string;
    tag: string;
    description: string;
    status: string;
    createdAt: Date | null;
    endDate: Date | null;
    resourceTypes: ResourceTypeDefinition[];
}

export type FixedInputsBase = GenericField;

export interface FixedInputDefinition {
    fixedInputId: string;
    name: string;
    value: string;
    productId: string;
    createdAt: string;

    // Display only?
    description: string;
    required: boolean;
}

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
    productBlocks: ProductBlockBase[]; // todo: will be renamed in productBlockInstance

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

export interface ProductDefinition {
    productId: string;
    name: string;
    description: string;
    tag: string;
    createdAt: string;
    productType: string;
    status: string;
    productBlocks: Pick<ProductBlockDefinition, 'name'>[];
    fixedInputs: Pick<FixedInputDefinition, 'name' | 'value'>[];
}

// Todo: this one is incomplete
// Todo rename, this is not a Definition --> Process
export type ProcessDefinition = {
    workflowName: string;
    lastStep: string;
    status: string;
    // target: string;
    product: string;
    customer: string;
    // abbrev: string; // currently not in backend, not sure if it will be added
    subscriptions: {
        page: Pick<Subscription, 'subscriptionId' | 'description'>[];
    };
    createdBy: string;
    assignee: string;
    id: string;
    started: string; // DateTime
    lastModified: string; // DateTime
};

// Todo: this will replace the generated Subscription
// Currently partially implemented since it is used in Process object
export type Subscription = {
    subscriptionId: string;
    description: string;
};

export type Field<Type> = keyof Type;

//// Utility types

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

type GraphQLPageInfo = {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: number;
    totalItems: number;
    endCursor: number;
};

export interface ProductDefinitionsResult {
    products: {
        page: ProductDefinition[];
        pageInfo: GraphQLPageInfo;
    };
}

export interface ProductBlockDefinitionsResult {
    productBlocks: GraphQlResultPage<ProductBlockDefinition>;
}

export interface ResourceTypeDefinitionsResult {
    resourceTypes: GraphQlResultPage<ResourceTypeDefinition>;
}

export interface ProcessesDefinitionsResult {
    processes: GraphQlResultPage<ProcessDefinition>;
}

interface GraphQlResultPage<T> {
    page: T[];
    pageInfo: GraphQLPageInfo;
}

export interface CacheOption {
    value: string;
    label: string;
}

export enum Locale {
    enUS = 'en-Us',
    nlNL = 'nl-NL',
}
