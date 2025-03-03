import { ReactNode } from 'react';

import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';

import { InputForm } from './forms';

export type Nullable<T> = T | null;

type GenericResponse = { [key: string]: unknown };

export type StringifyObject<T extends object> = {
    [key in keyof T]: string;
};

export type FieldValue = {
    field: string;
    value: string | number | boolean | null;
};

export type RenderableFieldValue = {
    field: string;
    value: FieldValue['value'] | ReactNode;
};

export enum EngineStatus {
    RUNNING = 'RUNNING',
    PAUSING = 'PAUSING',
    PAUSED = 'PAUSED',
    UNKNOWN = 'UNKNOWN',
}

export enum WorkerTypes {
    CELERY = 'CELERY',
    THREAD = 'THREAD',
}

export type Customer = {
    fullname: string;
    customerId: string;
    shortcode: string;
};

export type CustomerWithSubscriptionCount = Customer & {
    subscriptions: {
        pageInfo: {
            totalItems: number;
        };
    };
};

export type InUseByRelation = {
    subscription_instance_id: string;
    subscription_id: string;
};

export type ProductBlockInstance = {
    id: number;
    subscriptionInstanceId: string;
    parent: Nullable<number>;
    productBlockInstanceValues: FieldValue[];
    inUseByRelations: InUseByRelation[];
    subscription: Pick<Subscription, 'subscriptionId' | 'description'>;
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
    PRODUCT = 'product',
    TASK = 'task',
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
    isOutsideCurrentSubscription: boolean;
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
    traceback: string | null;
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
    workflowId: string;
    name: string;
    description?: string;
    target: WorkflowTarget;
    products: Pick<ProductDefinition, 'tag' | 'productId' | 'name'>[];
    createdAt: string;
}

export interface TaskDefinition {
    workflowId: string;
    name: string;
    description?: string;
    target: WorkflowTarget;
    products: Pick<ProductDefinition, 'tag' | 'productId' | 'name'>[];
    createdAt: string;
}

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

export interface CustomersWithSubscriptionCountResult {
    customers: GraphQlSinglePage<CustomerWithSubscriptionCount>;
}

export interface TaskDefinitionsResult<T = TaskDefinition> {
    workflows: GraphQlResultPage<T>;
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

export interface InUseByRelationsDetailResult {
    subscriptions: GraphQlSinglePage<InUseByRelationDetail>;
}

export type StartComboBoxOption = {
    data: {
        workflowName: string;
        productId?: string;
    };
    label: string;
};

export interface GraphQlResultPage<T> {
    page: T[];
    pageInfo: GraphQLPageInfo;
}

export interface GraphQlSinglePage<T> {
    page: T[];
}

export interface CacheOption {
    value: string;
    label: string;
}

export type CacheNames = { [key: string]: string };

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
    inUseBySubscriptions: {
        pageInfo: Pick<GraphQLPageInfo, 'totalItems'>;
    };
};

export type CustomerDescriptions = {
    id: string;
    subscriptionId: string;
    description: string;
    customerId: string;
};

export type MetadataDescriptionParams = {
    id: string;
    description: string;
};

// export type Workflow = {
//     workflow_id: string;
//     description: string;
// };

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
    customerDescriptions: CustomerDescriptions[];

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

export type InUseByRelationDetail = Pick<
    Subscription,
    'subscriptionId' | 'description'
> & {
    product: Pick<ProductDefinition, 'name'>;
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
    workflowInformationLinkUrl: string;
    authActive: boolean;
    useWebSockets: boolean;
    useThemeToggle: boolean;
    showWorkflowInformationLink: boolean;
    enableSupportMenuItem: boolean;
    supportMenuItemUrl: string;
};

export enum ColorModes {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

export interface SubscriptionAction {
    name: string;
    description: string;
    reason?: string;
    usable_when?: string[];
    locked_relations?: string[];
    unterminated_parents?: string[];
    unterminated_in_use_by_subscriptions?: string[];
    status?: string;
    action?: string;
}

export type SubscriptionActions = {
    reason?: string;
    locked_relations?: string[];
    modify: SubscriptionAction[];
    terminate: SubscriptionAction[];
    system: SubscriptionAction[];
};

export enum CacheTagType {
    workerStatus = 'workerStatus',
    engineStatus = 'engineStatus',
    processes = 'processes',
    processStatusCounts = 'processStatusCounts',
    subscriptions = 'subscriptions',
}
export type CacheTag = { type: CacheTagType; id?: string };

export const CACHETAG_TYPE_LIST = 'LIST';
