import { _EuiThemeColorsMode } from '@elastic/eui/src/global_styling/variables/colors';

export type Nullable<T> = T | null;

type GenericField = { [key: string]: number | string | boolean };

export type OrganisationBase = {
    abbreviation?: string; // Todo: Is this SURF specific?
    name?: string; // Todo: whis it this optional?
    // Todo check if website and tel are visible via GenericField
} & GenericField;

export type ProductBase = {
    name: string;
    description: string;
    status: string;
    tag: string;
    type: string;
    createdAt: string; // Todo: why is it a string?
    endDate?: string; // Todo: why is it a string?
} & GenericField;

export type ResourceTypeBase = {
    name: string;
    title: string;
    subscriptionInstanceId: string; // Todo: fix messy naming behaviour in pythia
    ownerSubscriptionId: string; // Todo: fix messy naming behaviour in pythia
    label?: string;
} & GenericField;

export type ProductBlockBase = {
    id: number;
    ownerSubscriptionId: string;
    parent: Nullable<number>;
    resourceTypes: ResourceTypeBase;
};

export type FixedInputsBase = {} & GenericField;

export type ExternalServiceBase = {
    externalServiceKey: string;
    externalServiceId: string;
    externalServiceData: any;
} & GenericField;

export type SubscriptionDetailBase = {
    // Top level subscription fields
    subscriptionId: string;
    description: string;
    customerId: string; // Todo: shape of new customer name in core is unknown, add customer now?
    insync: boolean;
    status: string;
    startDate?: string; // Todo: why is it a string?
    endDate?: string; // Todo: why is it a string?
    note?: string;

    // Nested attributes
    product: ProductBase;
    fixedInputs: FixedInputsBase;
    organisation: OrganisationBase; // Todo: settle on Organisation or Customer?
    productBlocks: ProductBlockBase[];

    // Todo: it might be better to store these into a separate state key in the Subscription Context
    externalServices?: ExternalServiceBase[];
}; // Todo: are customers allowed to add nested attributes?

export interface ItemsList {
    type: string;
    title: string;
    // items: Subscription[] | Process[]; // Todo: avoid circular dependency
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

export interface Product {
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

export interface externalServiceField {
    externalServiceKey: string;
    dataKey: string;
}
