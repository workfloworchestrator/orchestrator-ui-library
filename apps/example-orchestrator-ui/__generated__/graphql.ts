/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date with time (isoformat) */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  UUID: any;
  _Any: any;
};

export enum Assignee {
  Changes = 'CHANGES',
  Klantsupport = 'KLANTSUPPORT',
  Noc = 'NOC',
  System = 'SYSTEM'
}

export type BaseError = {
  message: Scalars['String'];
};

export type CacheClearResponse = CacheClearSuccess | Error;

export type CacheClearSuccess = {
  __typename?: 'CacheClearSuccess';
  deleted: Scalars['Int'];
};

export type EngineSettingsType = {
  __typename?: 'EngineSettingsType';
  globalLock: Scalars['Boolean'];
  globalStatus?: Maybe<GlobalStatusEnum>;
  runningProcesses: Scalars['Int'];
};

export type Error = BaseError & {
  __typename?: 'Error';
  message: Scalars['String'];
};

export type FixedInput = {
  __typename?: 'FixedInput';
  createdAt: Scalars['DateTime'];
  fixedInputId: Scalars['UUID'];
  name: Scalars['String'];
  productId: Scalars['UUID'];
  value: Scalars['String'];
};

export enum GlobalStatusEnum {
  Paused = 'PAUSED',
  Pausing = 'PAUSING',
  Running = 'RUNNING'
}

export type GraphqlFilter = {
  field: Scalars['String'];
  value: Scalars['String'];
};

export type GraphqlSort = {
  field: Scalars['String'];
  order: SortOrder;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Clear a redis cache by name */
  clearCache: CacheClearResponse;
  /** Update global status of the engine */
  updateStatus: StatusUpdateResponse;
};


export type MutationClearCacheArgs = {
  name: Scalars['String'];
};


export type MutationUpdateStatusArgs = {
  globalLock: Scalars['Boolean'];
};

/** Pagination context to navigate objects with cursor-based pagination */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['Int']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['Int']>;
  totalItems?: Maybe<Scalars['String']>;
};

export type ProcessFormType = {
  __typename?: 'ProcessFormType';
  additionalProperties: Scalars['Boolean'];
  definitions?: Maybe<Scalars['JSON']>;
  properties: Scalars['JSON'];
  required: Array<Scalars['String']>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export enum ProcessStatus {
  Aborted = 'ABORTED',
  ApiUnavailable = 'API_UNAVAILABLE',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Failed = 'FAILED',
  InconsistentData = 'INCONSISTENT_DATA',
  Resumed = 'RESUMED',
  Running = 'RUNNING',
  Suspended = 'SUSPENDED',
  Waiting = 'WAITING'
}

export type ProcessStepType = {
  __typename?: 'ProcessStepType';
  commitHash?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  executed?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  state?: Maybe<Scalars['JSON']>;
  status: Scalars['String'];
  stepid?: Maybe<Scalars['UUID']>;
};

export type ProcessType = {
  __typename?: 'ProcessType';
  assignee: Assignee;
  createdBy?: Maybe<Scalars['String']>;
  currentState?: Maybe<Scalars['JSON']>;
  customer?: Maybe<Scalars['UUID']>;
  failedReason?: Maybe<Scalars['String']>;
  form?: Maybe<ProcessFormType>;
  id: Scalars['UUID'];
  isTask: Scalars['Boolean'];
  lastModified: Scalars['DateTime'];
  lastStep?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['UUID']>;
  started: Scalars['DateTime'];
  status: ProcessStatus;
  step?: Maybe<Scalars['String']>;
  steps: Array<ProcessStepType>;
  /** Returns list of subscriptions of the process */
  subscriptions: SubscriptionTypeConnection;
  traceback?: Maybe<Scalars['String']>;
  workflowName: Scalars['String'];
};


export type ProcessTypeSubscriptionsArgs = {
  after?: Scalars['Int'];
  filterBy?: InputMaybe<Array<GraphqlFilter>>;
  first?: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort>>;
};

/** Represents a paginated relationship between two entities */
export type ProcessTypeConnection = {
  __typename?: 'ProcessTypeConnection';
  page: Array<ProcessType>;
  pageInfo: PageInfo;
};

export type ProductBlock = {
  __typename?: 'ProductBlock';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  endDate?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  productBlockId: Scalars['UUID'];
  resourceTypes?: Maybe<Array<ResourceType>>;
  status: ProductLifecycle;
  tag?: Maybe<Scalars['String']>;
};

export enum ProductLifecycle {
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
  PhaseOut = 'PHASE_OUT',
  PreProduction = 'PRE_PRODUCTION'
}

export type ProductType = {
  __typename?: 'ProductType';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  endDate?: Maybe<Scalars['DateTime']>;
  fixedInputs: Array<FixedInput>;
  name: Scalars['String'];
  productBlocks: Array<ProductBlock>;
  productId: Scalars['UUID'];
  productType: Scalars['String'];
  status: ProductLifecycle;
  /** Returns list of subscriptions of the product type */
  subscriptions: SubscriptionTypeConnection;
  tag: Scalars['String'];
  workflows: Array<Workflow>;
};


export type ProductTypeSubscriptionsArgs = {
  after?: Scalars['Int'];
  filterBy?: InputMaybe<Array<GraphqlFilter>>;
  first?: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort>>;
};

/** Represents a paginated relationship between two entities */
export type ProductTypeConnection = {
  __typename?: 'ProductTypeConnection';
  page: Array<ProductType>;
  pageInfo: PageInfo;
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  /** Returns list of processes */
  processes: ProcessTypeConnection;
  /** Returns list of products */
  products: ProductTypeConnection;
  /** Returns information about cache, workers, and global engine settings */
  settings: StatusType;
  /** Returns list of subscriptions */
  subscriptions: SubscriptionTypeConnection;
};


export type QueryProcessesArgs = {
  after?: Scalars['Int'];
  filterBy?: InputMaybe<Array<GraphqlFilter>>;
  first?: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort>>;
};


export type QueryProductsArgs = {
  after?: Scalars['Int'];
  filterBy?: InputMaybe<Array<GraphqlFilter>>;
  first?: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort>>;
};


export type QuerySubscriptionsArgs = {
  after?: Scalars['Int'];
  filterBy?: InputMaybe<Array<GraphqlFilter>>;
  first?: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort>>;
};

export type ResourceType = {
  __typename?: 'ResourceType';
  description?: Maybe<Scalars['String']>;
  resourceType: Scalars['String'];
  resourceTypeId: Scalars['UUID'];
};

/** Sort order (ASC or DESC) */
export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StatusType = {
  __typename?: 'StatusType';
  cacheNames?: Maybe<Scalars['JSON']>;
  engineSettings?: Maybe<EngineSettingsType>;
  workerStatus?: Maybe<WorkerStatusType>;
};

export type StatusUpdateResponse = EngineSettingsType | Error;

export type SubscriptionDescriptionType = {
  __typename?: 'SubscriptionDescriptionType';
  createdAt?: Maybe<Scalars['DateTime']>;
  customerId: Scalars['UUID'];
  description: Scalars['String'];
  id: Scalars['UUID'];
  subscriptionId: Scalars['UUID'];
};

export type SubscriptionProductBlock = {
  __typename?: 'SubscriptionProductBlock';
  id: Scalars['Int'];
  ownerSubscriptionId: Scalars['UUID'];
  parent?: Maybe<Scalars['Int']>;
  resourceTypes: Scalars['JSON'];
};

export type SubscriptionType = {
  __typename?: 'SubscriptionType';
  customerDescriptions: Array<Maybe<SubscriptionDescriptionType>>;
  /** Returns list of subscriptions that this subscription depends on */
  dependsOnSubscriptions: SubscriptionTypeConnection;
  description: Scalars['String'];
  endDate?: Maybe<Scalars['DateTime']>;
  /** Returns list of subscriptions that use this subscription */
  inUseBySubscriptions: SubscriptionTypeConnection;
  insync: Scalars['Boolean'];
  note?: Maybe<Scalars['String']>;
  /** Returns list of processes of the subscription */
  processes: ProcessTypeConnection;
  product: ProductType;
  /** Return all products blocks that are part of a subscription */
  productBlocks: Array<SubscriptionProductBlock>;
  productId: Scalars['UUID'];
  startDate?: Maybe<Scalars['DateTime']>;
  status: Scalars['String'];
  subscriptionId: Scalars['UUID'];
};


export type SubscriptionTypeDependsOnSubscriptionsArgs = {
  after?: Scalars['Int'];
  filterBy?: InputMaybe<Array<GraphqlFilter>>;
  first?: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort>>;
};


export type SubscriptionTypeInUseBySubscriptionsArgs = {
  after?: Scalars['Int'];
  filterBy?: InputMaybe<Array<GraphqlFilter>>;
  first?: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort>>;
};


export type SubscriptionTypeProcessesArgs = {
  after?: Scalars['Int'];
  filterBy?: InputMaybe<Array<GraphqlFilter>>;
  first?: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort>>;
};


export type SubscriptionTypeProductBlocksArgs = {
  resourceTypes?: InputMaybe<Array<Scalars['String']>>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Represents a paginated relationship between two entities */
export type SubscriptionTypeConnection = {
  __typename?: 'SubscriptionTypeConnection';
  page: Array<SubscriptionType>;
  pageInfo: PageInfo;
};

export enum Target {
  Create = 'CREATE',
  Modify = 'MODIFY',
  System = 'SYSTEM',
  Terminate = 'TERMINATE'
}

export type WorkerStatusType = {
  __typename?: 'WorkerStatusType';
  executorType: Scalars['String'];
  numberOfQueuedJobs: Scalars['Int'];
  numberOfRunningJobs: Scalars['Int'];
  numberOfWorkersOnline: Scalars['Int'];
};

export type Workflow = {
  __typename?: 'Workflow';
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  target: Target;
  workflowId: Scalars['UUID'];
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String'];
};

export type MetadataProductsQueryVariables = Exact<{
  first: Scalars['Int'];
  after: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort> | GraphqlSort>;
}>;


export type MetadataProductsQuery = { __typename?: 'Query', products: { __typename?: 'ProductTypeConnection', page: Array<{ __typename?: 'ProductType', name: string, description: string, tag: string, createdAt: any, productType: string, status: ProductLifecycle, productBlocks: Array<{ __typename?: 'ProductBlock', name: string }> }>, pageInfo: { __typename?: 'PageInfo', endCursor?: number | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: number | null, totalItems?: string | null } } };

export type SubscriptionDetailOutlineQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type SubscriptionDetailOutlineQuery = { __typename?: 'Query', subscriptions: { __typename?: 'SubscriptionTypeConnection', page: Array<{ __typename?: 'SubscriptionType', subscriptionId: any, description: string, insync: boolean, note?: string | null, endDate?: any | null, startDate?: any | null, status: string, product: { __typename?: 'ProductType', createdAt: any, name: string, status: ProductLifecycle, endDate?: any | null, description: string, tag: string, productType: string }, productBlocks: Array<{ __typename?: 'SubscriptionProductBlock', id: number, ownerSubscriptionId: any, parent?: number | null, resourceTypes: any }> }> } };

export type SubscriptionDetailCompleteQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type SubscriptionDetailCompleteQuery = { __typename?: 'Query', subscriptions: { __typename?: 'SubscriptionTypeConnection', page: Array<{ __typename?: 'SubscriptionType', subscriptionId: any, description: string, insync: boolean, note?: string | null, endDate?: any | null, startDate?: any | null, status: string, product: { __typename?: 'ProductType', createdAt: any, name: string, status: ProductLifecycle, endDate?: any | null, description: string, tag: string, productType: string }, productBlocks: Array<{ __typename?: 'SubscriptionProductBlock', id: number, ownerSubscriptionId: any, parent?: number | null, resourceTypes: any }> }> } };

export type SubscriptionsTableQueryVariables = Exact<{
  first: Scalars['Int'];
  after: Scalars['Int'];
  sortBy?: InputMaybe<Array<GraphqlSort> | GraphqlSort>;
  filterBy?: InputMaybe<Array<GraphqlFilter> | GraphqlFilter>;
}>;


export type SubscriptionsTableQuery = { __typename?: 'Query', subscriptions: { __typename?: 'SubscriptionTypeConnection', page: Array<{ __typename?: 'SubscriptionType', note?: string | null, startDate?: any | null, endDate?: any | null, description: string, insync: boolean, status: string, subscriptionId: any, product: { __typename?: 'ProductType', name: string, tag: string, productType: string } }>, pageInfo: { __typename?: 'PageInfo', totalItems?: string | null, startCursor?: number | null, hasPreviousPage: boolean, hasNextPage: boolean, endCursor?: number | null } } };


export const MetadataProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MetadataProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GraphqlSort"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"productBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]}}]} as unknown as DocumentNode<MetadataProductsQuery, MetadataProductsQueryVariables>;
export const SubscriptionDetailOutlineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubscriptionDetailOutline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filterBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"StringValue","value":"subscriptionId","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"insync"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"productBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ownerSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"parent"}},{"kind":"Field","name":{"kind":"Name","value":"resourceTypes"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubscriptionDetailOutlineQuery, SubscriptionDetailOutlineQueryVariables>;
export const SubscriptionDetailCompleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubscriptionDetailComplete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filterBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"StringValue","value":"subscriptionId","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"insync"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"productBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ownerSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"parent"}},{"kind":"Field","name":{"kind":"Name","value":"resourceTypes"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubscriptionDetailCompleteQuery, SubscriptionDetailCompleteQueryVariables>;
export const SubscriptionsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubscriptionsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GraphqlSort"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GraphqlFilter"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"insync"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"productType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<SubscriptionsTableQuery, SubscriptionsTableQueryVariables>;