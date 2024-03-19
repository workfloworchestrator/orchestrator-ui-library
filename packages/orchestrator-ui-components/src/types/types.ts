import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';

import { InputForm } from './forms';

export type Nullable<T> = T | null;

type GenericResponse = { [key: string]: unknown };

export type FieldValue = {
    field: string;
    value: string | number | boolean;
};

export type KeyValue = {
    key: string;
    value: string | number | boolean | undefined;
};

export enum EngineStatus {
    RUNNING = 'RUNNING',
    PAUSING = 'PAUSING',
    PAUSED = 'PAUSED',
    UNKNOWN = 'UNKNOWN',
}

export type Customer = {
    fullname: string;
    customerId: string;
    shortcode: string;
};

export type InUseByRelation = {
    subscription_instance_id: string;
    subscription_id: string;
};

export type ProductBlockInstance = {
    id: number;
    ownerSubscriptionId: string;
    subscriptionInstanceId: string;
    parent: Nullable<number>;
    productBlockInstanceValues: FieldValue[];
    inUseByRelations: InUseByRelation[];
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
    label: string | number | boolean;
    callback: () => void;
    children: TreeBlock[];
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

export type ProductsSummary = Pick<ProductDefinition, 'name'> &
    SubscriptionsResult<never>;

export enum WorkflowTarget {
    CREATE = 'create',
    MODIFY = 'modify',
    TERMINATE = 'terminate',
    SYSTEM = 'system',
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
    isTask: boolean;
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
    form?: InputForm; // If there is a step that contains a form, this is the form
    lastModifiedAt: Process['lastModifiedAt'];
    workflowName: string;
    isTask: boolean;
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

export const ProcessDoneStatuses = [
    ProcessStatus.COMPLETED,
    ProcessStatus.ABORTED,
];

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
    state: StepState | undefined;
    stateDelta: StepState;
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

export type FetchFilter<Type> = GraphqlFilter<Type>;

export type GraphqlQueryVariables<Type> = {
    first?: number;
    after?: number;
    sortBy?: GraphQLSort<Type>;
    filterBy?: GraphqlFilter<Type>[];
    query?: string;
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

export type BaseGraphQlResult = {
    pageInfo: GraphQLPageInfo;
};

export interface SubscriptionsResult<T = Subscription> {
    subscriptions: GraphQlResultPage<T>;
}

export interface SubscriptionDropdownOptionsResult {
    subscriptions: GraphQlSinglePage<SubscriptionDropdownOption>;
}

export interface SubscriptionDetailResult {
    subscriptions: GraphQlResultPage<SubscriptionDetail>;
}

export interface ProductDefinitionsResult<T = ProductDefinition> {
    products: GraphQlResultPage<T>;
}
export interface StartProcessStep {
    name: Step['name'];
}

export interface ProcessStepsResult {
    workflows: GraphQlSinglePage<{ steps: StartProcessStep[] }>;
}

export interface ProductBlockDefinitionsResult {
    productBlocks: GraphQlResultPage<ProductBlockDefinition>;
}

export interface ResourceTypeDefinitionsResult {
    resourceTypes: GraphQlResultPage<ResourceTypeDefinition>;
}

export interface ProcessListResult<T = Process> {
    processes: GraphQlResultPage<T>;
}

export interface ProcessesDetailResult {
    processes: GraphQlSinglePage<ProcessDetail>;
}

export type ProcessDetailResultRaw = {
    subscription?: object;
    subscription_id?: string;
    current_state: {
        subscription?: {
            subscription_id?: string;
        } & GenericResponse;
        __old_subscriptions__?: GenericResponse;
    } & GenericResponse;
} & GenericResponse;

export interface CustomersResult {
    customers: GraphQlSinglePage<Customer>;
}

export interface WorkflowDefinitionsResult<T = WorkflowDefinition> {
    workflows: GraphQlResultPage<T>;
}

export interface StartOptionsResult<T> {
    workflows: GraphQlSinglePage<T>;
}

export interface RelatedSubscriptionsResult {
    subscriptions: GraphQlSinglePage<
        Pick<Subscription, 'subscriptionId'> & {
            inUseBySubscriptions: GraphQlResultPage<RelatedSubscription>;
        }
    >;
}

export type StartComboBoxOption = {
    data: {
        workflowName: string;
        productId?: string;
    };
    label: string;
};

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
    enGB = 'en-GB',
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
    productBlockInstances: ProductBlockInstance[];
    customer: Pick<Customer, 'fullname' | 'shortcode'>;
    metadata: object;
};

export type SubscriptionSummary = Pick<
    Subscription,
    'subscriptionId' | 'description' | 'startDate'
>;

export type SubscriptionDropdownOption = {
    description: Subscription['description'];
    subscriptionId: Subscription['subscriptionId'];
    product: Pick<ProductDefinition, 'tag' | 'productId'>;
    customer: Pick<Customer, 'fullname' | 'customerId'>;
    productBlockInstances: ProductBlockInstance[];
    fixedInputs: FieldValue[];
    tag: string;
    status: SubscriptionStatus;
};

export type SubscriptionDetail = {
    subscriptionId: string;
    description: string;
    insync: boolean;
    note: string;
    fixedInputs: FieldValue[];
    product: Pick<
        ProductDefinition,
        | 'createdAt'
        | 'name'
        | 'status'
        | 'description'
        | 'tag'
        | 'productType'
        | 'productId'
    > & {
        endDate: string;
    };
    endDate: string;
    startDate: string;
    status: SubscriptionStatus;
    metadata: object;
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
    | 'isTask'
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

export type WfoTreeNodeMap = { [key: number]: TreeBlock };

export type { Toast };

export enum ToastTypes {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
}

export enum Environment {
    DEVELOPMENT = 'Development',
    PRODUCTION = 'Production',
}

export type OrchestratorConfig = {
    environmentName: Environment | string;
    orchestratorWebsocketUrl: string;
    orchestratorApiBaseUrl: string;
    graphqlEndpointCore: string;
    engineStatusEndpoint: string;
    processStatusCountsEndpoint: string;
    processesEndpoint: string;
    subscriptionActionsEndpoint: string;
    subscriptionProcessesEndpoint: string;
    authActive: boolean;
};

export enum ColorModes {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}
