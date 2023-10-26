import { _EuiThemeColorsMode } from '@elastic/eui/src/global_styling/variables/colors';

export type UnionOfInterfaceTypes<T> = T[keyof T];

export type Nullable<T> = T | null;

type GenericField = { [key: string]: number | string | boolean };

export type FieldValue = {
    field: string;
    value: string | number;
};

export type KeyValue = {
    key: string;
    value: string | number | boolean | undefined;
};

export type EngineStatusValue = 'RUNNING' | 'PAUSING' | 'PAUSED';

export type Customer = {
    fullname: string;
    identifier: string;
    shortcode: string;
};

export type ResourceTypeBase = {
    name: string;
    title: string;
    subscriptionInstanceId: string;
    ownerSubscriptionId: string;
    label?: string;
} & GenericField;

export type ProductBlockInstance = {
    id: number;
    ownerSubscriptionId: string;
    parent: Nullable<number>;
    productBlockInstanceValues: FieldValue[];
};

export interface ResourceTypeDefinition {
    description: string;
    resourceType: string;
    resourceTypeId: string;
    productBlocks: ProductBlockDefinition[];
}

export interface ProductBlockDefinition {
    productBlockId: string;
    name: string;
    tag: string;
    description: string;
    status: ProductLifecycleStatus;
    createdAt: string;
    endDate: string | null;
    resourceTypes: ResourceTypeDefinition[];
    dependsOn: ProductBlockDefinition[];
}

export enum ProductLifecycleStatus {
    ACTIVE = 'active',
    PRE_PRODUCTION = 'pre production',
    PHASE_OUT = 'phase out',
    END_OF_LIFE = 'end of life',
}

export enum BadgeType {
    WORKFLOW = 'workflow',
    FIXED_INPUT = 'fixed_input',
    RESOURCE_TYPE = 'resource_type',
    PRODUCT_BLOCK = 'product_block',
    PRODUCT_BLOCK_TAG = 'product_block_tag',
    PRODUCT_TAG = 'product_tag',
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

export interface TreeBlock extends ProductBlockInstance {
    icon: string;
    label: string | number;
    callback: () => void;
    children: TreeBlock[];
}

export interface ItemsList {
    type: string;
    title: string;
    items: ProcessFromRestApi[];
    buttonName: string;
}

export interface TotalStat {
    icon: string;
    name: string;
    value: number;
    color: keyof _EuiThemeColorsMode;
}

// Todo: Temporary renamed this type, will be fixed in:
// https://github.com/workfloworchestrator/orchestrator-ui/issues/216
export interface ProcessFromRestApi {
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
    status: ProductLifecycleStatus;
    productBlocks: Pick<ProductBlockDefinition, 'name'>[];
    fixedInputs: Pick<FixedInputDefinition, 'name' | 'value'>[];
}

export enum WorkflowTarget {
    CREATE = 'create',
    MODIFY = 'modify',
    TERMINATE = 'terminate',
    SYSTEM = 'system',
    UPGRADE = 'upgrade',
}

export type Process = {
    workflowName: string;
    lastStep: string;
    lastStatus: ProcessStatus;
    workflowTarget: WorkflowTarget;
    product?: {
        name: string;
        tag: string;
    };
    customer: {
        fullname: string;
        shortcode: string;
    };
    createdBy: string;
    assignee: string;
    processId: string;
    startedAt: string;
    lastModifiedAt: string;
    subscriptions: {
        page: Pick<Subscription, 'subscriptionId' | 'description'>[];
    };
};

// These step statusses match the ones in the backend
export enum StepStatus {
    FORM = 'form', // Only this one is frontend only
    SUCCESS = 'success',
    FAILED = 'failed',
    PENDING = 'pending',
    RUNNING = 'running',
    SKIPPED = 'skipped',
    SUSPEND = 'suspend',
    WAITING = 'waiting',
    AWAITING_CALLBACK = 'awaiting_callback',
    ABORT = 'abort',
    COMPLETE = 'complete',
}

export interface ProcessDetail {
    processId: Process['processId'];
    lastStatus: Process['lastStatus'];
    createdBy: Process['createdBy'];
    startedAt: Process['startedAt'];
    lastStep: string;
    lastModifiedAt: Process['lastModifiedAt'];
    workflowName: string;
    steps: Step[];
    subscriptions: {
        page: {
            product: Pick<ProductDefinition, 'name'>;
            description: Subscription['description'];
            subscriptionId: Subscription['subscriptionId'];
        }[];
    };
    customer: {
        fullname: string;
    };
}

// From backend
export enum ProcessStatus {
    CREATE = 'create', // Frontend only
    CREATED = 'created',
    RUNNING = 'running',
    SUSPENDED = 'suspended',
    WAITING = 'waiting',
    AWAITING_CALLBACK = 'awaiting_callback',
    ABORTED = 'aborted',
    FAILED = 'failed',
    RESUMED = 'resumed',
    API_UNAVAILABLE = 'api_unavailable',
    INCONSISTENT_DATA = 'inconsistent_data',
    COMPLETED = 'completed',
}

export interface StepState {
    [index: string]: object | boolean | string | number | [];
}

export interface EmailAddress {
    name: string;
    email: string;
}

export interface EmailState {
    to: EmailAddress[];
    cc: EmailAddress[];
    message: string;
    subject: string;
}

export interface Step {
    name: string;
    status: StepStatus;
    stepId: string; // sic backend
    executed: string;
    state: StepState;
}

export interface WorkflowDefinition {
    name: string;
    description?: string;
    target: WorkflowTarget;
    products: Pick<ProductDefinition, 'tag' | 'productId' | 'name'>[];
    createdAt: string;
}

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
    first?: number;
    after?: number;
    sortBy?: GraphQLSort<Type>;
    filterBy?: GraphqlFilter<Type>[];
};

export type GraphQLPageInfo = {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: number | null;
    totalItems: number | null;
    endCursor: number | null;
    sortFields: string[];
    filterFields: string[];
};

export interface SubscriptionsResult {
    subscriptions: GraphQlResultPage<Subscription>;
}

export interface SubscriptionDetailResult {
    subscriptions: GraphQlResultPage<SubscriptionDetail>;
}

export interface ProductDefinitionsResult {
    products: GraphQlResultPage<ProductDefinition>;
}

export interface ProductBlockDefinitionsResult {
    productBlocks: GraphQlResultPage<ProductBlockDefinition>;
}

export interface ResourceTypeDefinitionsResult {
    resourceTypes: GraphQlResultPage<ResourceTypeDefinition>;
}

export interface ProcessesResult {
    processes: GraphQlResultPage<Process>;
}

export interface ProcessesDetailResult {
    processes: GraphQlSinglePage<ProcessDetail>;
}

export interface WorkflowDefinitionsResult<T = WorkflowDefinition> {
    workflows: GraphQlResultPage<T>;
}

export interface RelatedSubscriptionsResult {
    subscriptions: GraphQlSinglePage<
        Pick<Subscription, 'subscriptionId'> & {
            inUseBySubscriptions: GraphQlResultPage<RelatedSubscription>;
        }
    >;
}

interface GraphQlResultPage<T> {
    page: T[];
    pageInfo: GraphQLPageInfo;
}

interface GraphQlSinglePage<T> {
    page: T[];
}

export interface CacheOption {
    value: string;
    label: string;
}

export enum Locale {
    enUS = 'en-Us',
    nlNL = 'nl-NL',
}

export enum SubscriptionStatus {
    INITIAL = 'initial',
    ACTIVE = 'active',
    MIGRATING = 'migrating',
    DISABLED = 'disabled',
    TERMINATED = 'terminated',
    PROVISIONING = 'provisioning',
}

export type Subscription = {
    subscriptionId: string;
    description: string;
    note: string | null;
    startDate: string | null;
    endDate: string | null;
    insync: boolean;
    status: SubscriptionStatus;
    product: Pick<ProductDefinition, 'name' | 'tag' | 'productType'>;
};

export type SubscriptionDetail = {
    subscriptionId: string;
    description: string;
    insync: boolean;
    note: string;
    fixedInputs: FieldValue[];
    product: Pick<
        ProductDefinition,
        'createdAt' | 'name' | 'status' | 'description' | 'tag' | 'productType'
    > & {
        endDate: string;
    };
    endDate: string;
    startDate: string;
    status: SubscriptionStatus;
    productBlockInstances: ProductBlockInstance[];

    customerId?: string | null;
    customer?: Customer;
    externalServices?: ExternalService[];

    processes: GraphQlSinglePage<SubscriptionDetailProcess>;
};

export type SubscriptionDetailProcess = Pick<
    Process,
    | 'processId'
    | 'lastStatus'
    | 'startedAt'
    | 'createdBy'
    | 'workflowTarget'
    | 'workflowName'
>;

export type RelatedSubscription = Pick<
    Subscription,
    'subscriptionId' | 'description' | 'status' | 'startDate' | 'insync'
> & {
    product: Pick<ProductDefinition, 'tag'>;
    customer: Pick<Customer, 'fullname'>;
};

export type ExternalService = {
    externalServiceKey: string;
    externalServiceId: string;
    externalServiceData: object;
};
