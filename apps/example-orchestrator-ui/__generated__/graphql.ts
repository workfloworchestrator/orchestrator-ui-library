/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** Represent the Orchestrator AsPrepend data type */
    AsPrepend: any;
    /** Represent the Asn data type which can be an int of 64 bits */
    Asn: any;
    /** Represent the Orchestrator BgpSessionPriority data type */
    BgpSessionPriority: any;
    /** Date (isoformat) */
    Date: any;
    /** Date with time (isoformat) */
    DateTime: any;
    /** Represent the Orchestrator Domain data type */
    Domain: any;
    /** The `JSON` scalar type represents JSON values as specified by ECMA-404 */
    JSON: any;
    /** Represent the Orchestrator MTU data type */
    MTU: any;
    /** Represent the MaxPrefix data type which can be an int of 64 bits */
    MaxPrefix: any;
    /** Represent the MetricOut data type */
    MetricOut: any;
    UUID: any;
    _Any: any;
};

/** Access point information */
export type AccessPoint = {
    __typename?: 'AccessPoint';
    brand: Scalars['String'];
    ciStatus: Scalars['String'];
    firmwareVersion: Scalars['String'];
    key: Scalars['String'];
    model: Scalars['String'];
    name: Scalars['String'];
    serialNumber: Scalars['String'];
    startDate: Scalars['DateTime'];
    supplier: Scalars['String'];
};

/** Filter access points by attribute */
export type AccessPointFilter = {
    /** Excluded access point statuses */
    statusExcludedFilter?: InputMaybe<Array<Scalars['String']>>;
    /** Included access point statuses */
    statusIncludedFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Access point statistics */
export type AccessPointStats = {
    __typename?: 'AccessPointStats';
    active: Scalars['Int'];
    inactive: Scalars['Int'];
};

export type AffectedSubscription = {
    __typename?: 'AffectedSubscription';
    subscription?: Maybe<MyBaseSubscription>;
    subscriptionId: Scalars['UUID'];
};

/** Aggregated service port subscription */
export type AggregatedServicePortSubscription = MyBaseSubscription & {
    __typename?: 'AggregatedServicePortSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    port: Sn8AggregatedServicePortBlock;
    portSpeed: Scalars['Int'];
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** Aggregated service port subscription */
export type AggregatedServicePortSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Aggregated service port subscription */
export type AggregatedServicePortSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** Aggregated service port subscription */
export type AggregatedServicePortSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Aggregated service port subscription */
export type AggregatedServicePortSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Content with language, short and long description */
export type Content = {
    __typename?: 'Content';
    description: ContentDescription;
    /** Language of the long and short description */
    language: Scalars['String'];
};

/** Content description in short and long format */
export type ContentDescription = {
    __typename?: 'ContentDescription';
    /** Long description */
    long: Scalars['String'];
    /** Short description */
    short: Scalars['String'];
};

/** Corelink subscription */
export type CorelinkSubscription = MyBaseSubscription & {
    __typename?: 'CorelinkSubscription';
    corelink: Sn8CorelinkBlock;
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** Corelink subscription */
export type CorelinkSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Corelink subscription */
export type CorelinkSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** Corelink subscription */
export type CorelinkSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Corelink subscription */
export type CorelinkSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Address information from CRM */
export type CrmAddress = {
    __typename?: 'CrmAddress';
    addition?: Maybe<Scalars['String']>;
    city?: Maybe<Scalars['String']>;
    countryCode?: Maybe<Scalars['String']>;
    extraAddressLine?: Maybe<Scalars['String']>;
    number?: Maybe<Scalars['String']>;
    street?: Maybe<Scalars['String']>;
    type?: Maybe<Scalars['String']>;
    zipcode?: Maybe<Scalars['String']>;
};

/** Contact information from CRM */
export type CrmContact = {
    __typename?: 'CrmContact';
    contactMediums: Array<CrmContactMedium>;
    department?: Maybe<Scalars['String']>;
    firstName?: Maybe<Scalars['String']>;
    function?: Maybe<Scalars['String']>;
    gender?: Maybe<Scalars['String']>;
    initials?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    middleName?: Maybe<Scalars['String']>;
    owners: Array<CrmOwner>;
    preferredLanguage?: Maybe<Scalars['String']>;
    roles: Array<CrmContactRole>;
    status?: Maybe<Scalars['String']>;
    titlePostfix?: Maybe<Scalars['String']>;
    titlePrefix?: Maybe<Scalars['String']>;
    uuid?: Maybe<Scalars['String']>;
};

/** Contact medium information from CRM */
export type CrmContactMedium = {
    __typename?: 'CrmContactMedium';
    type?: Maybe<Scalars['String']>;
    value?: Maybe<Scalars['String']>;
};

/** Contact role information from CRM */
export type CrmContactRole = {
    __typename?: 'CrmContactRole';
    type?: Maybe<Scalars['String']>;
    value?: Maybe<Scalars['String']>;
};

/** Location from CRM */
export type CrmLocation = {
    __typename?: 'CrmLocation';
    addresses: Array<CrmAddress>;
    code: Scalars['String'];
    /** Get organisation at this location */
    organisation: CrmOrganisation;
    type: Scalars['String'];
    uuid: Scalars['UUID'];
};

/** Organisation information from CRM */
export type CrmOrganisation = {
    __typename?: 'CrmOrganisation';
    abbreviation?: Maybe<Scalars['String']>;
    /** Get addresses, optional filtered by type */
    addresses: Array<CrmAddress>;
    customerId?: Maybe<Scalars['UUID']>;
    email?: Maybe<Scalars['String']>;
    fax?: Maybe<Scalars['String']>;
    name?: Maybe<Scalars['String']>;
    status?: Maybe<Scalars['String']>;
    tel?: Maybe<Scalars['String']>;
    website?: Maybe<Scalars['String']>;
};

/** Organisation information from CRM */
export type CrmOrganisationAddressesArgs = {
    typeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Owner information from CRM */
export type CrmOwner = {
    __typename?: 'CrmOwner';
    email?: Maybe<Scalars['String']>;
    fullName?: Maybe<Scalars['String']>;
    mobilePhone?: Maybe<Scalars['String']>;
    phone?: Maybe<Scalars['String']>;
};

/** Customer */
export type Customer = {
    __typename?: 'Customer';
    /** List of contacts for this customer */
    contacts?: Maybe<Array<CrmContact>>;
    id: Scalars['UUID'];
    /** List of minimal impacted notifications for this customer */
    minimalImpactNotifications?: Maybe<Array<MinimalImpactNotification>>;
    /** The organisation this customer belongs to */
    organisation?: Maybe<CrmOrganisation>;
    /** List of subscriptions for this customer */
    subscriptions?: Maybe<Array<MyBaseSubscription>>;
};

/** Customer */
export type CustomerContactsArgs = {
    contactIncludedActiveRoleFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Customer */
export type CustomerSubscriptionsArgs = {
    productsExcludedFilter?: InputMaybe<Array<Scalars['String']>>;
    productsIncludedFilter?: InputMaybe<Array<Scalars['String']>>;
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type CustomerDescription = {
    __typename?: 'CustomerDescription';
    createdAt: Scalars['Float'];
    customerId: Scalars['String'];
    description?: Maybe<Scalars['String']>;
    id: Scalars['String'];
    subscriptionId: Scalars['String'];
};

export type CustomerSubscriptionDescription = {
    __typename?: 'CustomerSubscriptionDescription';
    createdAt?: Maybe<Scalars['String']>;
    customerId: Scalars['UUID'];
    description: Scalars['String'];
    id?: Maybe<Scalars['UUID']>;
    subscriptionId: Scalars['UUID'];
};

export type CustomerSubscriptionDescriptionPythiaNotFoundPythiaError =
    | CustomerSubscriptionDescription
    | PythiaError
    | PythiaNotFound;

/** Return status of Workflow engine. */
export type EngineStatus = {
    __typename?: 'EngineStatus';
    /** Workflow engine locked for maintenance? */
    globalLock: Scalars['Boolean'];
    /** Textual representation of status */
    globalStatus: Scalars['String'];
    /** Number of currently running workflow processes */
    runningProcesses: Scalars['Int'];
};

/** Firewall subscription */
export type FirewallSubscription = MyBaseSubscription & {
    __typename?: 'FirewallSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewall: FwBlock;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    protectionType: Scalars['String'];
    size: Scalars['Int'];
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** Firewall subscription */
export type FirewallSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Firewall subscription */
export type FirewallSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** Firewall subscription */
export type FirewallSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Firewall subscription */
export type FirewallSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

export type FwBlock = ProductBlockModel & {
    __typename?: 'FwBlock';
    asn: Scalars['Asn'];
    availabilityZoneName: Scalars['String'];
    customerAsn: Scalars['Asn'];
    deployType: Scalars['String'];
    ipGwEndpoint?: Maybe<FwIpGwEndpointBlock>;
    l2Endpoints: Array<FwL2EndpointBlock>;
    l3Endpoints: Array<FwL3EndpointBlock>;
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    nfvServiceId: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type FwBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type FwBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type FwIpGwEndpointBlock = ProductBlockModel & {
    __typename?: 'FwIpGwEndpointBlock';
    endpointDescription: Scalars['String'];
    ip: Sn8IpBgpVirtualCircuitBlock;
    l2vpnInternal: Sn8L2VpnVirtualCircuitBlock;
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type FwIpGwEndpointBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type FwIpGwEndpointBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type FwL2EndpointBlock = ProductBlockModel & {
    __typename?: 'FwL2EndpointBlock';
    customerPtpIpv4PrimaryIpam?: Maybe<Ipam>;
    customerPtpIpv4PrimaryIpamId?: Maybe<Scalars['Int']>;
    customerPtpIpv4SecondaryIpam: Array<Ipam>;
    customerPtpIpv4SecondaryIpamIds: Array<Scalars['Int']>;
    customerPtpIpv6PrimaryIpam?: Maybe<Ipam>;
    customerPtpIpv6PrimaryIpamId?: Maybe<Scalars['Int']>;
    customerPtpIpv6SecondaryIpam: Array<Ipam>;
    customerPtpIpv6SecondaryIpamIds: Array<Scalars['Int']>;
    endpointDescription: Scalars['String'];
    esis: Array<Sn8L2VpnEsiBlock>;
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type FwL2EndpointBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type FwL2EndpointBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type FwL3EndpointBlock = ProductBlockModel & {
    __typename?: 'FwL3EndpointBlock';
    endpointDescription: Scalars['String'];
    l2vpnInternal: Sn8L2VpnVirtualCircuitBlock;
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    saps: Array<Sn8ServiceAttachPointBlock>;
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type FwL3EndpointBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type FwL3EndpointBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Health */
export type Health = {
    __typename?: 'Health';
    /** Health of workflow engine */
    orchestrator: ServiceHealth;
};

export type Ims = {
    __typename?: 'Ims';
    aliases: Array<Scalars['String']>;
    allEndpoints: Array<ImsEndpoint>;
    customerId: Scalars['UUID'];
    domain?: Maybe<Scalars['String']>;
    endpoints: Array<ImsEndpoint>;
    extraInfo: Scalars['String'];
    id: Scalars['Int'];
    location?: Maybe<Scalars['String']>;
    /** Location owner */
    locationOwner?: Maybe<CrmOrganisation>;
    name: Scalars['String'];
    orderId: Scalars['String'];
    /**
     * Location owner
     * @deprecated Use location_owner instead
     */
    organisation?: Maybe<CrmOrganisation>;
    /**
     * Retrieve the first endpoint of type 'port' from the service
     * @deprecated Use endpoints with a 'type' filter and 'limit' instead
     */
    port?: Maybe<ImsPort>;
    product: Scalars['String'];
    speed: Scalars['String'];
    status: Scalars['String'];
};

export type ImsEndpointsArgs = {
    limit?: InputMaybe<Scalars['Int']>;
    type?: InputMaybe<ImsEndpointType>;
};

/** Detailed information about an IMS circuit */
export type ImsCircuit = ImsProvider & {
    __typename?: 'ImsCircuit';
    ims?: Maybe<Ims>;
    /** Circuit identifier in IMS */
    imsCircuitId: Scalars['Int'];
    /** List of planned work for this circuit */
    plannedWork: Array<ImsPlannedWorkWithCustomerInfo>;
};

/** Detailed information about an IMS circuit */
export type ImsCircuitPlannedWorkArgs = {
    active?: Scalars['Boolean'];
    beginTimestamp?: InputMaybe<Scalars['DateTime']>;
    endTimestamp?: InputMaybe<Scalars['DateTime']>;
};

/** IMS customer info */
export type ImsCustomerInfo = {
    __typename?: 'ImsCustomerInfo';
    contents: Scalars['String'];
    label: Scalars['String'];
};

export type ImsEndpoint = {
    id?: Maybe<Scalars['Int']>;
    /** Location code */
    location?: Maybe<Scalars['String']>;
    /** Location owner */
    locationOwner?: Maybe<CrmOrganisation>;
    /**
     * Location owner
     * @deprecated Use location_owner instead
     */
    organisation?: Maybe<CrmOrganisation>;
    type: ImsEndpointType;
    vlanranges?: Maybe<Array<Scalars['String']>>;
};

export enum ImsEndpointType {
    InternalPort = 'INTERNAL_PORT',
    Internet = 'INTERNET',
    Port = 'PORT',
    Service = 'SERVICE',
}

export type ImsInternalPort = ImsEndpoint & {
    __typename?: 'ImsInternalPort';
    id?: Maybe<Scalars['Int']>;
    lineName?: Maybe<Scalars['String']>;
    location: Scalars['String'];
    /** Location owner */
    locationOwner?: Maybe<CrmOrganisation>;
    node: Scalars['String'];
    /**
     * Location owner
     * @deprecated Use location_owner instead
     */
    organisation?: Maybe<CrmOrganisation>;
    port: Scalars['String'];
    type: ImsEndpointType;
    vlanranges?: Maybe<Array<Scalars['String']>>;
};

/** IMS planned work log */
export type ImsPlannedWorkLog = {
    __typename?: 'ImsPlannedWorkLog';
    entryDatetime: Scalars['DateTime'];
    id: Scalars['Int'];
    language?: Maybe<Scalars['String']>;
    logging: Scalars['String'];
};

/** Detailed information about planned work in IMS */
export type ImsPlannedWorkWithCustomerInfo = {
    __typename?: 'ImsPlannedWorkWithCustomerInfo';
    category: Scalars['String'];
    /** Get long or short description in different languages */
    contents: Array<Content>;
    /** @deprecated Use contents property instead */
    customerInfo: Array<ImsCustomerInfo>;
    customersInformed: Scalars['Int'];
    description: Scalars['String'];
    endDatetime: Scalars['DateTime'];
    expirationDate: Scalars['Date'];
    id: Scalars['Int'];
    logs: Array<ImsPlannedWorkLog>;
    name: Scalars['String'];
    outageTime: Scalars['String'];
    plannedTime: Scalars['DateTime'];
    relatedCircuits: Array<ImsPlannedWorkWithCustomerInfoRelatedCircuits>;
    startDatetime: Scalars['DateTime'];
    status: Scalars['String'];
};

/** Detailed information about planned work in IMS */
export type ImsPlannedWorkWithCustomerInfoContentsArgs = {
    language?: InputMaybe<Scalars['String']>;
};

export type ImsPlannedWorkWithCustomerInfoRelatedCircuits = ImsProvider & {
    __typename?: 'ImsPlannedWorkWithCustomerInfoRelatedCircuits';
    downType: Scalars['Int'];
    ims?: Maybe<Ims>;
    imsCircuitId: Scalars['Int'];
};

export type ImsPort = ImsEndpoint & {
    __typename?: 'ImsPort';
    connectorType?: Maybe<Scalars['String']>;
    fiberType?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['Int']>;
    ifaceType?: Maybe<Scalars['String']>;
    lineName?: Maybe<Scalars['String']>;
    location: Scalars['String'];
    /** Location owner */
    locationOwner?: Maybe<CrmOrganisation>;
    node: Scalars['String'];
    /**
     * Location owner
     * @deprecated Use location_owner instead
     */
    organisation?: Maybe<CrmOrganisation>;
    patchposition?: Maybe<Scalars['String']>;
    port: Scalars['String'];
    status: Scalars['String'];
    type: ImsEndpointType;
    vlanranges?: Maybe<Array<Scalars['String']>>;
};

/** Provides IMS information based on ims_circuit_id */
export type ImsProvider = {
    ims?: Maybe<Ims>;
    /** Unique circuit identifier in IMS */
    imsCircuitId?: Maybe<Scalars['Int']>;
};

export type ImsService = ImsEndpoint & {
    __typename?: 'ImsService';
    id?: Maybe<Scalars['Int']>;
    /** Location code */
    location?: Maybe<Scalars['String']>;
    /** Location owner */
    locationOwner?: Maybe<CrmOrganisation>;
    /**
     * Location owner
     * @deprecated Use location_owner instead
     */
    organisation?: Maybe<CrmOrganisation>;
    /** Get Ims service */
    service?: Maybe<Ims>;
    type: ImsEndpointType;
    vlanranges?: Maybe<Array<Scalars['String']>>;
};

export enum InetFamily {
    IPv4 = 'IPv4',
    IPv6 = 'IPv6',
}

/** The IP BGP subscription type. */
export type IpBgpSubscription = MyBaseSubscription & {
    __typename?: 'IpBgpSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    ipRoutingType: Scalars['String'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vc: Sn8IpBgpVirtualCircuitBlock;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The IP BGP subscription type. */
export type IpBgpSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP BGP subscription type. */
export type IpBgpSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The IP BGP subscription type. */
export type IpBgpSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP BGP subscription type. */
export type IpBgpSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

export type IpPeerBlock = ProductBlockModel & {
    __typename?: 'IpPeerBlock';
    asPrepend: Scalars['AsPrepend'];
    asn: Scalars['Asn'];
    blackholeCommunity: Scalars['String'];
    communityListOut: Array<Scalars['String']>;
    ipv4MaxPrefix?: Maybe<Scalars['MaxPrefix']>;
    ipv6MaxPrefix?: Maybe<Scalars['MaxPrefix']>;
    label?: Maybe<Scalars['String']>;
    multipath: Scalars['Boolean'];
    name: Scalars['String'];
    nsoServiceId: Scalars['UUID'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    peerCommunity: Scalars['Asn'];
    peerName: Scalars['String'];
    peers: Array<PeerBlock>;
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type IpPeerBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type IpPeerBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type IpPeerGroupBlock = ProductBlockModel & {
    __typename?: 'IpPeerGroupBlock';
    interconnectionType: Scalars['String'];
    label?: Maybe<Scalars['String']>;
    metricOut?: Maybe<Scalars['Int']>;
    name: Scalars['String'];
    nsoServiceId: Scalars['UUID'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    peerCommunity?: Maybe<Scalars['Asn']>;
    peerGroupName: Scalars['String'];
    peerType: Scalars['String'];
    routeServers: Array<Scalars['String']>;
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type IpPeerGroupBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type IpPeerGroupBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer group subscription type. */
export type IpPeerGroupSubscription = MyBaseSubscription & {
    __typename?: 'IpPeerGroupSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    ipPeerGroupBlock: IpPeerGroupBlock;
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The IP Peer group subscription type. */
export type IpPeerGroupSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer group subscription type. */
export type IpPeerGroupSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The IP Peer group subscription type. */
export type IpPeerGroupSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer group subscription type. */
export type IpPeerGroupSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

export type IpPeerPortBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'IpPeerPortBlock';
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        ipv4IpamAddressId?: Maybe<Scalars['Int']>;
        ipv4Mtu: Scalars['MTU'];
        ipv6IpamAddressId?: Maybe<Scalars['Int']>;
        ipv6Mtu: Scalars['MTU'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        peerPortName: Scalars['String'];
        peerPortType: Scalars['String'];
        ptpIpv4IpamId?: Maybe<Scalars['Int']>;
        ptpIpv6IpamId?: Maybe<Scalars['Int']>;
        sap: Sn8ServiceAttachPointBlock;
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type IpPeerPortBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type IpPeerPortBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer port subscription type. */
export type IpPeerPortSubscription = MyBaseSubscription & {
    __typename?: 'IpPeerPortSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    ipPeerPortBlock: IpPeerPortBlock;
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The IP Peer port subscription type. */
export type IpPeerPortSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer port subscription type. */
export type IpPeerPortSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The IP Peer port subscription type. */
export type IpPeerPortSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer port subscription type. */
export type IpPeerPortSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer subscription type. */
export type IpPeerSubscription = MyBaseSubscription & {
    __typename?: 'IpPeerSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    ipPeerBlock: IpPeerBlock;
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The IP Peer subscription type. */
export type IpPeerSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer subscription type. */
export type IpPeerSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The IP Peer subscription type. */
export type IpPeerSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Peer subscription type. */
export type IpPeerSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

export type IpPrefixBlock = ProductBlockModel & {
    __typename?: 'IpPrefixBlock';
    customerAggregate: Scalars['Boolean'];
    extraInformation?: Maybe<Scalars['String']>;
    ipam?: Maybe<Ipam>;
    ipamPrefixId?: Maybe<Scalars['Int']>;
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    planned: Scalars['Boolean'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
    toInternet: Scalars['Boolean'];
};

export type IpPrefixBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type IpPrefixBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Prefix object from Orchestrator */
export type IpPrefixObject = {
    __typename?: 'IpPrefixObject';
    customer: CrmOrganisation;
    customerId: Scalars['UUID'];
    description?: Maybe<Scalars['String']>;
    family: InetFamily;
    ipam?: Maybe<Ipam>;
    ipamPrefixId: Scalars['Int'];
    parent: Scalars['String'];
    prefix: Scalars['String'];
    prefixSubscription: IpPrefixSubscription;
    prefixlen: Scalars['Int'];
    state: Scalars['Int'];
    stateLabel: Scalars['String'];
    subscriptionId: Scalars['UUID'];
};

/** The IP Prefix subscription type. */
export type IpPrefixSubscription = MyBaseSubscription & {
    __typename?: 'IpPrefixSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    ipPrefix: IpPrefixBlock;
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The IP Prefix subscription type. */
export type IpPrefixSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Prefix subscription type. */
export type IpPrefixSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The IP Prefix subscription type. */
export type IpPrefixSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP Prefix subscription type. */
export type IpPrefixSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP static subscription type. */
export type IpStaticSubscription = MyBaseSubscription & {
    __typename?: 'IpStaticSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    ipRoutingType: Scalars['String'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vc: Sn8IpStaticVirtualCircuitBlock;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The IP static subscription type. */
export type IpStaticSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP static subscription type. */
export type IpStaticSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The IP static subscription type. */
export type IpStaticSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IP static subscription type. */
export type IpStaticSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Prefix object from IPAM */
export type Ipam = {
    __typename?: 'Ipam';
    addresses: Array<IpamAddress>;
    afi: Scalars['String'];
    description: Scalars['String'];
    parent: Scalars['Int'];
    parentLabel: Scalars['String'];
    prefix: Scalars['String'];
    state: Scalars['String'];
    stateLabel: Scalars['String'];
    tags: Array<Scalars['String']>;
    vrf: Scalars['Int'];
    vrfLabel: Scalars['String'];
};

export type IpamAddress = {
    __typename?: 'IpamAddress';
    address: Scalars['String'];
    description: Scalars['String'];
    fqdn: Scalars['String'];
    id: Scalars['Int'];
    name: Scalars['String'];
    prefix: Scalars['Int'];
    state: Scalars['Int'];
    tags: Array<Scalars['String']>;
};

/** Prefix object from IPAM */
export type IpamPrefixObject = {
    __typename?: 'IpamPrefixObject';
    afi: Scalars['Int'];
    asn?: Maybe<Scalars['Int']>;
    asnLabel?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    id: Scalars['Int'];
    parent?: Maybe<Scalars['Int']>;
    parentLabel?: Maybe<Scalars['String']>;
    prefix: Scalars['String'];
    state: Scalars['Int'];
    stateLabel: Scalars['String'];
    tags: Array<Scalars['String']>;
    vrf: Scalars['Int'];
    vrfLabel: Scalars['String'];
};

/** The IRB port subscription type. */
export type IrbServicePortSubscription = MyBaseSubscription & {
    __typename?: 'IrbServicePortSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    port: Sn8IrbServicePortBlock;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The IRB port subscription type. */
export type IrbServicePortSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IRB port subscription type. */
export type IrbServicePortSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The IRB port subscription type. */
export type IrbServicePortSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The IRB port subscription type. */
export type IrbServicePortSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** JIRA issue */
export type JiraIssue = {
    __typename?: 'JiraIssue';
    key: Scalars['String'];
    /** tbd */
    ticket?: Maybe<JiraTicket>;
};

/** Ticket details */
export type JiraTicket = {
    __typename?: 'JiraTicket';
    assignee: Scalars['String'];
    comments: Array<TicketComment>;
    description: Scalars['String'];
    endDate?: Maybe<Scalars['DateTime']>;
    impact: Scalars['String'];
    startDate: Scalars['DateTime'];
    status: Scalars['String'];
    summary: Scalars['String'];
    thirdPartyWorkType?: Maybe<Scalars['String']>;
};

/** L2VPN subscription */
export type L2VpnSubscription = MyBaseSubscription & {
    __typename?: 'L2VpnSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vc: Sn8L2VpnVirtualCircuitBlock;
    vlanRange?: Maybe<Scalars['String']>;
};

/** L2VPN subscription */
export type L2VpnSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** L2VPN subscription */
export type L2VpnSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** L2VPN subscription */
export type L2VpnSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** L2VPN subscription */
export type L2VpnSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** L3VPN subscription */
export type L3VpnSubscription = MyBaseSubscription & {
    __typename?: 'L3VpnSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vc: Sn8L3VpnVirtualCircuitBlock;
    vlanRange?: Maybe<Scalars['String']>;
};

/** L3VPN subscription */
export type L3VpnSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** L3VPN subscription */
export type L3VpnSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** L3VPN subscription */
export type L3VpnSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** L3VPN subscription */
export type L3VpnSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** The LightPath Redundant subscription type. */
export type LightPathRedundantSubscription = MyBaseSubscription & {
    __typename?: 'LightPathRedundantSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    lrss: Sn8LightPathRedundantServiceSettingsBlock;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    protectionType: Scalars['String'];
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The LightPath Redundant subscription type. */
export type LightPathRedundantSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The LightPath Redundant subscription type. */
export type LightPathRedundantSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The LightPath Redundant subscription type. */
export type LightPathRedundantSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The LightPath Redundant subscription type. */
export type LightPathRedundantSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** The LightPath subscription type. */
export type LightPathSubscription = MyBaseSubscription & {
    __typename?: 'LightPathSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    protectionType: Scalars['String'];
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vc: Sn8LightPathVirtualCircuitBlock;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The LightPath subscription type. */
export type LightPathSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The LightPath subscription type. */
export type LightPathSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The LightPath subscription type. */
export type LightPathSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The LightPath subscription type. */
export type LightPathSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Setting for the minimal impact type at which you want notification */
export type MinimalImpactNotification = {
    __typename?: 'MinimalImpactNotification';
    createdAt?: Maybe<Scalars['Float']>;
    customerId: Scalars['UUID'];
    id?: Maybe<Scalars['UUID']>;
    impact: Scalars['String'];
    lastModified?: Maybe<Scalars['Float']>;
    /** Get organisation */
    organisation: CrmOrganisation;
    /** Get subscription */
    subscription: MyBaseSubscription;
    subscriptionId: Scalars['UUID'];
};

export type MinimalImpactNotificationPythiaError =
    | MinimalImpactNotification
    | PythiaError;

export type MinimalImpactNotificationPythiaNotFoundPythiaError =
    | MinimalImpactNotification
    | PythiaError
    | PythiaNotFound;

/** The MSC port subscription type. */
export type MscSubscription = MyBaseSubscription & {
    __typename?: 'MscSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    port: Sn8MscBlock;
    portSpeed: Scalars['Int'];
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The MSC port subscription type. */
export type MscSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The MSC port subscription type. */
export type MscSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The MSC port subscription type. */
export type MscSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The MSC port subscription type. */
export type MscSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Pythia mutations */
export type Mutation = {
    __typename?: 'Mutation';
    /** Delete customer description */
    removeCustomerDescription: CustomerSubscriptionDescriptionPythiaNotFoundPythiaError;
    /** Delete customer minimal impact notification */
    removeMinimalImpactNotification: MinimalImpactNotificationPythiaNotFoundPythiaError;
    /** Create a process in the Orchestrator */
    startProcess: ProcessCreatedPythiaError;
    /** Create or update customer description */
    upsertCustomerDescription: CustomerSubscriptionDescriptionPythiaNotFoundPythiaError;
    /** Create or update customer minimal impact notification */
    upsertMinimalImpactNotification: MinimalImpactNotificationPythiaError;
    /** Create or update user preferences */
    upsertUserPreferences: UserPreferencesPythiaError;
};

/** Pythia mutations */
export type MutationRemoveCustomerDescriptionArgs = {
    customerId: Scalars['UUID'];
    subscriptionId: Scalars['UUID'];
};

/** Pythia mutations */
export type MutationRemoveMinimalImpactNotificationArgs = {
    customerId: Scalars['UUID'];
    subscriptionId: Scalars['UUID'];
};

/** Pythia mutations */
export type MutationStartProcessArgs = {
    name: Scalars['String'];
    payload: Payload;
};

/** Pythia mutations */
export type MutationUpsertCustomerDescriptionArgs = {
    customerId: Scalars['UUID'];
    description: Scalars['String'];
    subscriptionId: Scalars['UUID'];
};

/** Pythia mutations */
export type MutationUpsertMinimalImpactNotificationArgs = {
    customerId: Scalars['UUID'];
    impact: Scalars['String'];
    subscriptionId: Scalars['UUID'];
};

/** Pythia mutations */
export type MutationUpsertUserPreferencesArgs = {
    onboarding: Scalars['Boolean'];
    preferenceDomain: Scalars['String'];
    username: Scalars['String'];
};

/** Virtual base class for detailed subscriptions */
export type MyBaseSubscription = {
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** Virtual base class for detailed subscriptions */
export type MyBaseSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Virtual base class for detailed subscriptions */
export type MyBaseSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** Virtual base class for detailed subscriptions */
export type MyBaseSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Virtual base class for detailed subscriptions */
export type MyBaseSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Represents a paginated relationship between two entities */
export type MyBaseSubscriptionConnection = {
    __typename?: 'MyBaseSubscriptionConnection';
    edges: Array<MyBaseSubscriptionEdge>;
    pageInfo: PageInfo;
};

/** An edge may contain additional information of the relationship */
export type MyBaseSubscriptionEdge = {
    __typename?: 'MyBaseSubscriptionEdge';
    cursor: Scalars['String'];
    node: MyBaseSubscription;
};

export type NodeProductBlock = ProductBlockModel & {
    __typename?: 'NodeProductBlock';
    bgpFullTable: Scalars['Boolean'];
    imsNodeId: Scalars['Int'];
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    nodeIpv4IpamId: Scalars['Int'];
    nodeIpv6IpamId: Scalars['Int'];
    nodeLocation: Scalars['String'];
    nsoDeviceId: Scalars['String'];
    nsoServiceId: Scalars['UUID'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    srNodeSegmentId: Scalars['Int'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type NodeProductBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type NodeProductBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The Node port subscription type. */
export type NodeSubscription = MyBaseSubscription & {
    __typename?: 'NodeSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    node: NodeProductBlock;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The Node port subscription type. */
export type NodeSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The Node port subscription type. */
export type NodeSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The Node port subscription type. */
export type NodeSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The Node port subscription type. */
export type NodeSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** The NSI LightPath subscription type. */
export type NsiLightPathSubscription = MyBaseSubscription & {
    __typename?: 'NsiLightPathSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vc: Sn8LightPathVirtualCircuitBlock;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The NSI LightPath subscription type. */
export type NsiLightPathSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The NSI LightPath subscription type. */
export type NsiLightPathSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The NSI LightPath subscription type. */
export type NsiLightPathSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The NSI LightPath subscription type. */
export type NsiLightPathSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

export type NsiStpBlock = ProductBlockModel & {
    __typename?: 'NsiStpBlock';
    bandwidth: Scalars['Int'];
    exposeInTopology: Scalars['Boolean'];
    isAliasIn: Scalars['String'];
    isAliasOut: Scalars['String'];
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    sap: Sn8ServiceAttachPointBlock;
    stpDescription: Scalars['String'];
    stpId: Scalars['String'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
    topology: Scalars['String'];
};

export type NsiStpBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type NsiStpBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The NSI STP subscription type. */
export type NsiStpSubscription = MyBaseSubscription & {
    __typename?: 'NsiStpSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    settings: NsiStpBlock;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The NSI STP subscription type. */
export type NsiStpSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The NSI STP subscription type. */
export type NsiStpSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The NSI STP subscription type. */
export type NsiStpSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The NSI STP subscription type. */
export type NsiStpSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Filter organisations by attribute */
export type OrganisationFilter = {
    /** List of customer UUIDs to filter by */
    customerIds?: InputMaybe<Array<Scalars['UUID']>>;
};

/** Pagination context to navigate objects with cursor-based pagination */
export type PageInfo = {
    __typename?: 'PageInfo';
    endCursor?: Maybe<Scalars['String']>;
    hasNextPage: Scalars['Boolean'];
    hasPreviousPage: Scalars['Boolean'];
    startCursor?: Maybe<Scalars['String']>;
    totalItems?: Maybe<Scalars['String']>;
};

/** Payload for process create */
export type Payload = {
    /** Payload */
    payload: Scalars['JSON'];
};

export type PeerBlock = PeerPortProvider &
    ProductBlockModel & {
        __typename?: 'PeerBlock';
        asPrepend?: Maybe<Scalars['AsPrepend']>;
        authKey?: Maybe<Scalars['String']>;
        bfd: Scalars['Boolean'];
        bfdMinimumInterval?: Maybe<Scalars['Int']>;
        bfdMultiplier?: Maybe<Scalars['Int']>;
        bgpExportRejectAll: Scalars['Boolean'];
        bgpImportRejectAll: Scalars['Boolean'];
        bgpSessionPriority?: Maybe<Scalars['BgpSessionPriority']>;
        ipv4RemoteAddress?: Maybe<Scalars['String']>;
        ipv6RemoteAddress?: Maybe<Scalars['String']>;
        label?: Maybe<Scalars['String']>;
        metricOut?: Maybe<Scalars['MetricOut']>;
        name: Scalars['String'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        peerGroup: IpPeerGroupBlock;
        port: IpPeerPortSubscription;
        portSubscriptionId: Scalars['UUID'];
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type PeerBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type PeerBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type PeerPortProvider = {
    port: IpPeerPortSubscription;
    portSubscriptionId: Scalars['UUID'];
};

/** Resolve port subscription information */
export type PortProvider = {
    port: MyBaseSubscription;
    portSubscriptionId: Scalars['UUID'];
};

/** The Service port subscription type. */
export type PortSubscription = MyBaseSubscription & {
    __typename?: 'PortSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    port: Sn8ServicePortBlock;
    portSpeed: Scalars['Int'];
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** The Service port subscription type. */
export type PortSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The Service port subscription type. */
export type PortSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** The Service port subscription type. */
export type PortSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** The Service port subscription type. */
export type PortSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Workflow details */
export type Process = {
    __typename?: 'Process';
    createdBy?: Maybe<Scalars['String']>;
    customerId?: Maybe<Scalars['UUID']>;
    id: Scalars['UUID'];
    isTask: Scalars['Boolean'];
    lastModified?: Maybe<Scalars['DateTime']>;
    lastStep?: Maybe<Scalars['String']>;
    productId?: Maybe<Scalars['UUID']>;
    started?: Maybe<Scalars['DateTime']>;
    status: Scalars['String'];
    steps: Array<ProcessStep>;
    workflowName: Scalars['String'];
};

/** Process status */
export type ProcessCreated = {
    __typename?: 'ProcessCreated';
    id: Scalars['UUID'];
};

export type ProcessCreatedPythiaError = ProcessCreated | PythiaError;

/** Process step details */
export type ProcessStep = {
    __typename?: 'ProcessStep';
    commitHash?: Maybe<Scalars['String']>;
    createdBy?: Maybe<Scalars['String']>;
    executed?: Maybe<Scalars['DateTime']>;
    id?: Maybe<Scalars['UUID']>;
    name: Scalars['String'];
    status: Scalars['String'];
};

/** Orchestrator Product information */
export type Product = {
    __typename?: 'Product';
    createdAt?: Maybe<Scalars['String']>;
    description: Scalars['String'];
    endDate?: Maybe<Scalars['String']>;
    /** Unique product identifier */
    id: Scalars['UUID'];
    name: Scalars['String'];
    /**
     * Unique product identifier
     * @deprecated Use id instead
     */
    productId: Scalars['String'];
    status: Scalars['String'];
    tag?: Maybe<Scalars['String']>;
    type: Scalars['String'];
};

export type ProductBlock = {
    __typename?: 'ProductBlock';
    id: Scalars['Int'];
    ownerSubscriptionId: Scalars['UUID'];
    parent?: Maybe<Scalars['Int']>;
    resourceTypes: Scalars['JSON'];
};

export type ProductBlockModel = {
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type ProductBlockModelOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type ProductBlockModelOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Detailed information about an Orchestrator product */
export type ProductDetails = {
    __typename?: 'ProductDetails';
    /** Product creation date */
    createdAt?: Maybe<Scalars['DateTime']>;
    /** Product description */
    description?: Maybe<Scalars['String']>;
    /** Product end date. If None, the product is still active */
    endDate?: Maybe<Scalars['DateTime']>;
    /** Unique product identifier */
    id?: Maybe<Scalars['UUID']>;
    /** Product name */
    name?: Maybe<Scalars['String']>;
    /** Product status */
    status?: Maybe<Scalars['String']>;
    /** List of subscriptions for this product */
    subscriptions: Array<MyBaseSubscription>;
    /** Product tag */
    tag?: Maybe<Scalars['String']>;
    /** Product type */
    type?: Maybe<Scalars['String']>;
};

/** Detailed information about an Orchestrator product */
export type ProductDetailsSubscriptionsArgs = {
    customerId: Scalars['UUID'];
    filter?: InputMaybe<SubscriptionFilter>;
};

/** Filter products by attribute */
export type ProductFilter = {
    /** Excluded product statuses */
    statusExcludedFilter?: InputMaybe<Array<Scalars['String']>>;
    /** Included product statuses */
    statusIncludedFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Resolve IPAM ipv4 and ipv6 information */
export type PtpIpamProvider = {
    ptpIpv4Ipam?: Maybe<Ipam>;
    ptpIpv4IpamId?: Maybe<Scalars['Int']>;
    ptpIpv6Ipam?: Maybe<Ipam>;
    ptpIpv6IpamId?: Maybe<Scalars['Int']>;
};

/** Generic class to capture errors */
export type PythiaError = {
    __typename?: 'PythiaError';
    /** Details of error cause */
    details?: Maybe<Scalars['String']>;
    /** Error message */
    message: Scalars['String'];
};

/** Error class if a resource couldn't be found (404) */
export type PythiaNotFound = {
    __typename?: 'PythiaNotFound';
    /** Details of error cause */
    details?: Maybe<Scalars['String']>;
    /** Error message */
    message: Scalars['String'];
};

/** Sort order (ASC or DESC) */
export enum PythiaSortOrder {
    Asc = 'ASC',
    Desc = 'DESC',
}

export type Query = {
    __typename?: 'Query';
    _entities: Array<Maybe<_Entity>>;
    _service: _Service;
    /** Returns a list of prefixes */
    allPrefixes: Array<IpamPrefixObject>;
    /** Returns customer information */
    customer: Customer;
    /** Returns the customer description */
    customerDescription: CustomerSubscriptionDescription;
    /** Returns all customers */
    customers: Array<CrmOrganisation>;
    /** Returns the workflow engine status */
    engineStatus: EngineStatus;
    /** Returns a list of free prefixes */
    freePrefixes: Array<Scalars['String']>;
    /** Returns health status of apis that Pythia relies upon */
    health: Health;
    /** Returns locations from CRM */
    locations: Array<CrmLocation>;
    /** Returns detailed information for a prefix */
    prefix: IpPrefixSubscription;
    /** Returns a list of prefixes */
    prefixSubscriptions: Array<IpPrefixObject>;
    /** Return process information from the Orchestrator */
    process: Process;
    /** Returns a list of Orchestrator products */
    products: Array<ProductDetails>;
    /** Returns subscription info */
    subscription: MyBaseSubscription;
    /** Returns a list of subscriptions */
    subscriptions: MyBaseSubscriptionConnection;
    /** Virtual root for user info */
    user: User;
};

export type Query_EntitiesArgs = {
    representations: Array<Scalars['_Any']>;
};

export type QueryAllPrefixesArgs = {
    vrf?: InputMaybe<Scalars['Int']>;
};

export type QueryCustomerArgs = {
    id: Scalars['ID'];
};

export type QueryCustomerDescriptionArgs = {
    customerId: Scalars['UUID'];
    subscriptionId: Scalars['UUID'];
};

export type QueryCustomersArgs = {
    filter?: InputMaybe<OrganisationFilter>;
};

export type QueryLocationsArgs = {
    locationTypeFilter?: InputMaybe<Scalars['String']>;
};

export type QueryPrefixArgs = {
    prefixId: Scalars['Int'];
};

export type QueryProcessArgs = {
    pid: Scalars['UUID'];
};

export type QueryProductsArgs = {
    filter?: InputMaybe<ProductFilter>;
    groupByType?: Scalars['Boolean'];
};

export type QuerySubscriptionArgs = {
    id: Scalars['ID'];
};

export type QuerySubscriptionsArgs = {
    after?: Scalars['Int'];
    filterBy?: InputMaybe<Array<Array<Scalars['String']>>>;
    first?: Scalars['Int'];
    sortBy?: InputMaybe<Array<SubscriptionsSort>>;
};

export type QueryUserArgs = {
    username: Scalars['String'];
};

/** Health status */
export type ServiceHealth = {
    __typename?: 'ServiceHealth';
    status: Scalars['String'];
};

export type Sn8AggregatedServicePortBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8AggregatedServicePortBlock';
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        /** List of ports */
        port: Array<MyBaseSubscription>;
        portMode: Scalars['String'];
        portSubscriptionId: Array<Scalars['UUID']>;
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8AggregatedServicePortBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8AggregatedServicePortBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8CorelinkAggregateBlock = ProductBlockModel & {
    __typename?: 'Sn8CorelinkAggregateBlock';
    corelinkIpv4IpamId: Scalars['Int'];
    corelinkIpv6IpamId: Scalars['Int'];
    imsAggregatePortId: Scalars['Int'];
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    node: NodeProductBlock;
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type Sn8CorelinkAggregateBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8CorelinkAggregateBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8CorelinkBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8CorelinkBlock';
        aggregates: Array<Sn8CorelinkAggregateBlock>;
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        isisMetric: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        portPairs: Array<Sn8CorelinkPortPairBlock>;
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8CorelinkBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8CorelinkBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8CorelinkPortPairBlock = ProductBlockModel & {
    __typename?: 'Sn8CorelinkPortPairBlock';
    imsCorelinkTrunkId: Scalars['Int'];
    imsPortId1: Scalars['Int'];
    imsPortId2: Scalars['Int'];
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type Sn8CorelinkPortPairBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8CorelinkPortPairBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpBgpServiceAttachPointSettingsBlock = ProductBlockModel &
    PtpIpamProvider & {
        __typename?: 'Sn8IpBgpServiceAttachPointSettingsBlock';
        bfd: Scalars['Boolean'];
        bfdMinimumInterval?: Maybe<Scalars['Int']>;
        bfdMultiplier?: Maybe<Scalars['Int']>;
        bgpExportPolicy: Scalars['String'];
        bgpHashAlgorithm: Scalars['String'];
        bgpPassword?: Maybe<Scalars['String']>;
        bgpSessionPriority: Scalars['BgpSessionPriority'];
        customerIpv4Mtu: Scalars['MTU'];
        customerIpv6Mtu?: Maybe<Scalars['MTU']>;
        enableRouting: Scalars['Boolean'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        prefixes: Array<IpPrefixBlock>;
        ptpIpv4Ipam?: Maybe<Ipam>;
        ptpIpv4IpamId: Scalars['Int'];
        ptpIpv6Ipam?: Maybe<Ipam>;
        ptpIpv6IpamId?: Maybe<Scalars['Int']>;
        sap: Sn8ServiceAttachPointBlock;
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8IpBgpServiceAttachPointSettingsBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpBgpServiceAttachPointSettingsBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpBgpServiceSettingsBlock = ProductBlockModel & {
    __typename?: 'Sn8IpBgpServiceSettingsBlock';
    asn: Scalars['Asn'];
    label?: Maybe<Scalars['String']>;
    multicast: Scalars['Boolean'];
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    pinPrefix: Array<IpPrefixBlock>;
    subscriptionInstanceId: Scalars['UUID'];
    surfcertFilter: Scalars['String'];
    surfcertFilterEnabled: Scalars['Boolean'];
    title?: Maybe<Scalars['String']>;
};

export type Sn8IpBgpServiceSettingsBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpBgpServiceSettingsBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpBgpVirtualCircuitBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8IpBgpVirtualCircuitBlock';
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        saps: Array<Sn8IpBgpServiceAttachPointSettingsBlock>;
        serviceSpeed: Scalars['Int'];
        settings: Sn8IpBgpServiceSettingsBlock;
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8IpBgpVirtualCircuitBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpBgpVirtualCircuitBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpStaticServiceAttachPointSettingsBlock = ProductBlockModel &
    PtpIpamProvider & {
        __typename?: 'Sn8IpStaticServiceAttachPointSettingsBlock';
        customerIpv4Mtu: Scalars['MTU'];
        customerIpv6Mtu?: Maybe<Scalars['MTU']>;
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        prefixes: Array<IpPrefixBlock>;
        ptpIpv4Ipam?: Maybe<Ipam>;
        ptpIpv4IpamId?: Maybe<Scalars['Int']>;
        ptpIpv6Ipam?: Maybe<Ipam>;
        ptpIpv6IpamId?: Maybe<Scalars['Int']>;
        sap: Sn8ServiceAttachPointBlock;
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8IpStaticServiceAttachPointSettingsBlockOtherSubscriptionIdsArgs =
    {
        statusFilter?: InputMaybe<Array<Scalars['String']>>;
    };

export type Sn8IpStaticServiceAttachPointSettingsBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpStaticServiceSettingsBlock = ProductBlockModel & {
    __typename?: 'Sn8IpStaticServiceSettingsBlock';
    label?: Maybe<Scalars['String']>;
    multicast: Scalars['Boolean'];
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    pinPrefix: Array<IpPrefixBlock>;
    subscriptionInstanceId: Scalars['UUID'];
    surfcertFilter: Scalars['String'];
    surfcertFilterEnabled: Scalars['Boolean'];
    title?: Maybe<Scalars['String']>;
};

export type Sn8IpStaticServiceSettingsBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpStaticServiceSettingsBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpStaticVirtualCircuitBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8IpStaticVirtualCircuitBlock';
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        sap: Sn8IpStaticServiceAttachPointSettingsBlock;
        serviceSpeed: Scalars['Int'];
        settings: Sn8IpStaticServiceSettingsBlock;
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8IpStaticVirtualCircuitBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IpStaticVirtualCircuitBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IrbServicePortBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8IrbServicePortBlock';
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        node: NodeProductBlock;
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8IrbServicePortBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8IrbServicePortBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L2VpnEsiBlock = ProductBlockModel & {
    __typename?: 'Sn8L2VpnEsiBlock';
    inUseByIds?: Maybe<Array<Scalars['UUID']>>;
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    saps: Array<Sn8ServiceAttachPointBlock>;
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type Sn8L2VpnEsiBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L2VpnEsiBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L2VpnVirtualCircuitBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8L2VpnVirtualCircuitBlock';
        bumFilter: Scalars['Boolean'];
        esis: Array<Sn8L2VpnEsiBlock>;
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        serviceSpeed: Scalars['Int'];
        speedPolicer: Scalars['Boolean'];
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
        vlanRetagging: Scalars['Boolean'];
    };

export type Sn8L2VpnVirtualCircuitBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L2VpnVirtualCircuitBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L3VpnServiceAttachPointSettingsBlock = ProductBlockModel & {
    __typename?: 'Sn8L3VpnServiceAttachPointSettingsBlock';
    asn: Scalars['Asn'];
    bfd: Scalars['Boolean'];
    bfdMinimumInterval?: Maybe<Scalars['Int']>;
    bfdMultiplier?: Maybe<Scalars['Int']>;
    bgpExportPolicy?: Maybe<Scalars['String']>;
    bgpHashAlgorithm?: Maybe<Scalars['String']>;
    bgpPassword?: Maybe<Scalars['String']>;
    bgpSessionPriority?: Maybe<Scalars['BgpSessionPriority']>;
    customerIpv4Mtu?: Maybe<Scalars['MTU']>;
    customerIpv6Mtu?: Maybe<Scalars['MTU']>;
    enableRouting?: Maybe<Scalars['Boolean']>;
    endpointRole?: Maybe<Scalars['String']>;
    ipv4Address?: Maybe<Scalars['String']>;
    ipv4MaxPrefix?: Maybe<Scalars['MaxPrefix']>;
    ipv4RemoteAddress?: Maybe<Scalars['String']>;
    ipv6Address?: Maybe<Scalars['String']>;
    ipv6MaxPrefix?: Maybe<Scalars['MaxPrefix']>;
    ipv6RemoteAddress?: Maybe<Scalars['String']>;
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    prefixes: Array<IpPrefixBlock>;
    ptpIpv4IpamId?: Maybe<Scalars['Int']>;
    ptpIpv6IpamId?: Maybe<Scalars['Int']>;
    sap: Sn8ServiceAttachPointBlock;
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
    urpf: Scalars['String'];
};

export type Sn8L3VpnServiceAttachPointSettingsBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L3VpnServiceAttachPointSettingsBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L3VpnServiceSettingsBlock = ProductBlockModel & {
    __typename?: 'Sn8L3VpnServiceSettingsBlock';
    asn: Scalars['Int'];
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

export type Sn8L3VpnServiceSettingsBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L3VpnServiceSettingsBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L3VpnVirtualCircuitBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8L3VpnVirtualCircuitBlock';
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        saps: Array<Sn8L3VpnServiceAttachPointSettingsBlock>;
        serviceSpeed: Scalars['Int'];
        settings: Sn8L3VpnServiceSettingsBlock;
        specificTemplate?: Maybe<Scalars['String']>;
        speedPolicer: Scalars['Boolean'];
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8L3VpnVirtualCircuitBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8L3VpnVirtualCircuitBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8LightPathRedundantServiceSettingsBlock = ProductBlockModel & {
    __typename?: 'Sn8LightPathRedundantServiceSettingsBlock';
    imsProtectionCircuitId: Scalars['Int'];
    label?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
    vcs: Array<Sn8LightPathVirtualCircuitBlock>;
};

export type Sn8LightPathRedundantServiceSettingsBlockOtherSubscriptionIdsArgs =
    {
        statusFilter?: InputMaybe<Array<Scalars['String']>>;
    };

export type Sn8LightPathRedundantServiceSettingsBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8LightPathVirtualCircuitBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8LightPathVirtualCircuitBlock';
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        remotePortShutdown: Scalars['Boolean'];
        saps: Array<Sn8ServiceAttachPointBlock>;
        serviceSpeed: Scalars['Int'];
        speedPolicer: Scalars['Boolean'];
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8LightPathVirtualCircuitBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8LightPathVirtualCircuitBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8MscBlock = ImsProvider &
    PortProvider &
    ProductBlockModel & {
        __typename?: 'Sn8MscBlock';
        ims?: Maybe<Ims>;
        imsCircuitId: Scalars['Int'];
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        port: MyBaseSubscription;
        portMode: Scalars['String'];
        portSubscriptionId: Scalars['UUID'];
        serviceTag: Scalars['Int'];
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8MscBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8MscBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8ServiceAttachPointBlock = PortProvider &
    ProductBlockModel & {
        __typename?: 'Sn8ServiceAttachPointBlock';
        label?: Maybe<Scalars['String']>;
        name: Scalars['String'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        port: MyBaseSubscription;
        portSubscriptionId: Scalars['UUID'];
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
        vlanrange: Scalars['String'];
    };

export type Sn8ServiceAttachPointBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8ServiceAttachPointBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8ServicePortBlock = ImsProvider &
    ProductBlockModel & {
        __typename?: 'Sn8ServicePortBlock';
        autoNegotiation?: Maybe<Scalars['Boolean']>;
        ignoreL3Incompletes: Scalars['Boolean'];
        ims?: Maybe<Ims>;
        imsCircuitId?: Maybe<Scalars['Int']>;
        label?: Maybe<Scalars['String']>;
        lldp: Scalars['Boolean'];
        name: Scalars['String'];
        nsoServiceId: Scalars['UUID'];
        /** Returns list of other_subscriptions ids */
        otherSubscriptionIds: Array<Scalars['UUID']>;
        /** Returns list of other subscriptions */
        otherSubscriptions: Array<MyBaseSubscription>;
        ownerSubscriptionId: Scalars['UUID'];
        portMode: Scalars['String'];
        subscriptionInstanceId: Scalars['UUID'];
        title?: Maybe<Scalars['String']>;
    };

export type Sn8ServicePortBlockOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export type Sn8ServicePortBlockOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

export enum SubscriptionBoundary {
    All = 'ALL',
    Owner = 'OWNER',
}

/** Filter subscriptions by attribute */
export type SubscriptionFilter = {
    /** Excluded subscription statuses */
    statusExcludedFilter?: InputMaybe<Array<Scalars['String']>>;
    /** Included subscription statuses */
    statusIncludedFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Sort subscriptions by attribute */
export type SubscriptionsSort = {
    /** Field to sort on */
    field: Scalars['String'];
    /** Sort order (ASC or DESC */
    order?: PythiaSortOrder;
};

/** Wireless subscription */
export type SurfWirelessSubscription = MyBaseSubscription & {
    __typename?: 'SurfWirelessSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    domain: Scalars['Domain'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
    wifiLocation: WifiLocation;
};

/** Wireless subscription */
export type SurfWirelessSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Wireless subscription */
export type SurfWirelessSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** Wireless subscription */
export type SurfWirelessSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Wireless subscription */
export type SurfWirelessSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Ticket comment */
export type TicketComment = {
    __typename?: 'TicketComment';
    createdAt: Scalars['DateTime'];
    text: Scalars['String'];
};

/** Used for (new) subscription types that are not implemented in Pythia yet */
export type UnknownSubscription = MyBaseSubscription & {
    __typename?: 'UnknownSubscription';
    customerDescriptions: Array<CustomerDescription>;
    customerId: Scalars['UUID'];
    /** Get depends_on subscriptions */
    dependsOn: Array<MyBaseSubscription>;
    description: Scalars['String'];
    endDate?: Maybe<Scalars['String']>;
    firewallEnabled: Scalars['Boolean'];
    /** Return fixed inputs */
    fixedInputs: Scalars['JSON'];
    /** Return all ims circuits */
    imsCircuits: Array<ImsCircuit>;
    /** Get in_use_by subscriptions */
    inUseBy: Array<MyBaseSubscription>;
    insync: Scalars['Boolean'];
    /** Get locations based on location code in description */
    locations: Array<CrmOrganisation>;
    /** List of minimal impacted notifications for this subscription */
    minimalImpactNotifications: Array<MinimalImpactNotification>;
    name?: Maybe<Scalars['String']>;
    note?: Maybe<Scalars['String']>;
    /** Return organisation on this subscription */
    organisation?: Maybe<CrmOrganisation>;
    portSubscriptionInstanceId?: Maybe<Scalars['UUID']>;
    product: Product;
    /** Return all products blocks that are part of a subscription */
    productBlocks: Array<ProductBlock>;
    startDate?: Maybe<Scalars['String']>;
    status: Scalars['String'];
    subscriptionId: Scalars['UUID'];
    tag?: Maybe<Scalars['String']>;
    vlanRange?: Maybe<Scalars['String']>;
};

/** Used for (new) subscription types that are not implemented in Pythia yet */
export type UnknownSubscriptionDependsOnArgs = {
    dependsOnStatusFilter?: InputMaybe<Array<Scalars['String']>>;
    productTypeFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Used for (new) subscription types that are not implemented in Pythia yet */
export type UnknownSubscriptionImsCircuitsArgs = {
    boundary?: SubscriptionBoundary;
};

/** Used for (new) subscription types that are not implemented in Pythia yet */
export type UnknownSubscriptionInUseByArgs = {
    inUseByFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Used for (new) subscription types that are not implemented in Pythia yet */
export type UnknownSubscriptionProductBlocksArgs = {
    resourceTypes?: InputMaybe<Array<Scalars['String']>>;
    tags?: InputMaybe<Array<Scalars['String']>>;
};

/** Customer */
export type User = {
    __typename?: 'User';
    /** User preferences for this user */
    preferences?: Maybe<UserPreferences>;
    username: Scalars['String'];
};

/** Customer */
export type UserPreferencesArgs = {
    preferenceDomain: Scalars['String'];
};

/** Return configuration needed to initiate OAuth2 implicit flow. */
export type UserPreferences = {
    __typename?: 'UserPreferences';
    /** Whether the user is onboarded */
    onboarding: Scalars['Boolean'];
};

export type UserPreferencesPythiaError = PythiaError | UserPreferences;

/** Information about WiFi location */
export type WifiLocation = ProductBlockModel & {
    __typename?: 'WifiLocation';
    apVendorName: Scalars['String'];
    /** Location details */
    detail?: Maybe<WirelessLocationDetail>;
    /** Issues for this location */
    issues: Array<JiraIssue>;
    jiraLocationId: Scalars['String'];
    label?: Maybe<Scalars['String']>;
    locationName: Scalars['String'];
    name: Scalars['String'];
    /** Returns list of other_subscriptions ids */
    otherSubscriptionIds: Array<Scalars['UUID']>;
    /** Returns list of other subscriptions */
    otherSubscriptions: Array<MyBaseSubscription>;
    ownerSubscriptionId: Scalars['UUID'];
    subscriptionInstanceId: Scalars['UUID'];
    title?: Maybe<Scalars['String']>;
};

/** Information about WiFi location */
export type WifiLocationOtherSubscriptionIdsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Information about WiFi location */
export type WifiLocationOtherSubscriptionsArgs = {
    statusFilter?: InputMaybe<Array<Scalars['String']>>;
};

/** Wireless location details */
export type WirelessLocationDetail = {
    __typename?: 'WirelessLocationDetail';
    /** List of access points */
    accessPoints: Array<AccessPoint>;
    address: Scalars['String'];
    city: Scalars['String'];
    country: Scalars['String'];
    institute: Scalars['String'];
    location?: Maybe<Scalars['String']>;
    locationId: Scalars['String'];
    name: Scalars['String'];
    /** Wireless statistics */
    stats: AccessPointStats;
};

/** Wireless location details */
export type WirelessLocationDetailAccessPointsArgs = {
    filter?: InputMaybe<AccessPointFilter>;
};

export type _Entity =
    | AffectedSubscription
    | AggregatedServicePortSubscription
    | CorelinkSubscription
    | FirewallSubscription
    | IpBgpSubscription
    | IpPeerGroupSubscription
    | IpPeerPortSubscription
    | IpPeerSubscription
    | IpPrefixSubscription
    | IpStaticSubscription
    | IrbServicePortSubscription
    | L2VpnSubscription
    | L3VpnSubscription
    | LightPathRedundantSubscription
    | LightPathSubscription
    | MscSubscription
    | NodeSubscription
    | NsiLightPathSubscription
    | NsiStpSubscription
    | PortSubscription
    | SurfWirelessSubscription
    | UnknownSubscription;

export type _Service = {
    __typename?: '_Service';
    sdl: Scalars['String'];
};

export type GetSubscriptionDetailOutlineQueryVariables = Exact<{
    id: Scalars['ID'];
}>;

export type GetSubscriptionDetailOutlineQuery = {
    __typename?: 'Query';
    subscription:
        | {
              __typename?: 'AggregatedServicePortSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'CorelinkSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'FirewallSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'IpBgpSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'IpPeerGroupSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'IpPeerPortSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'IpPeerSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'IpPrefixSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'IpStaticSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'IrbServicePortSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'L2VpnSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'L3VpnSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'LightPathRedundantSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'LightPathSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'MscSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'NodeSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'NsiLightPathSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'NsiStpSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'PortSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'SurfWirelessSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          }
        | {
              __typename?: 'UnknownSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
          };
};

export type GetSubscriptionDetailCompleteQueryVariables = Exact<{
    id: Scalars['ID'];
}>;

export type GetSubscriptionDetailCompleteQuery = {
    __typename?: 'Query';
    subscription:
        | {
              __typename?: 'AggregatedServicePortSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'CorelinkSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'FirewallSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'IpBgpSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'IpPeerGroupSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'IpPeerPortSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'IpPeerSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'IpPrefixSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'IpStaticSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'IrbServicePortSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'L2VpnSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'L3VpnSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'LightPathRedundantSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'LightPathSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'MscSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'NodeSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'NsiLightPathSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'NsiStpSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'PortSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'SurfWirelessSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          }
        | {
              __typename?: 'UnknownSubscription';
              subscriptionId: any;
              customerId: any;
              description: string;
              fixedInputs: any;
              insync: boolean;
              note?: string | null;
              endDate?: string | null;
              startDate?: string | null;
              status: string;
              product: {
                  __typename?: 'Product';
                  createdAt?: string | null;
                  name: string;
                  status: string;
                  endDate?: string | null;
                  description: string;
                  tag?: string | null;
                  type: string;
              };
              organisation?: {
                  __typename?: 'CrmOrganisation';
                  abbreviation?: string | null;
                  name?: string | null;
                  website?: string | null;
                  tel?: string | null;
              } | null;
              productBlocks: Array<{
                  __typename?: 'ProductBlock';
                  id: number;
                  ownerSubscriptionId: any;
                  parent?: number | null;
                  resourceTypes: any;
              }>;
              imsCircuits: Array<{
                  __typename?: 'ImsCircuit';
                  ims?: {
                      __typename?: 'Ims';
                      product: string;
                      speed: string;
                      id: number;
                      extraInfo: string;
                      location?: string | null;
                      name: string;
                      endpoints: Array<
                          | {
                                __typename?: 'ImsInternalPort';
                                id?: number | null;
                                lineName?: string | null;
                                node: string;
                                port: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                          | {
                                __typename?: 'ImsPort';
                                id?: number | null;
                                lineName?: string | null;
                                fiberType?: string | null;
                                ifaceType?: string | null;
                                patchposition?: string | null;
                                port: string;
                                status: string;
                                node: string;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                                connectorType?: string | null;
                            }
                          | {
                                __typename?: 'ImsService';
                                id?: number | null;
                                type: ImsEndpointType;
                                vlanranges?: Array<string> | null;
                            }
                      >;
                  } | null;
              }>;
          };
};

export type SubscriptionGridQueryVariables = Exact<{
    first: Scalars['Int'];
    after: Scalars['Int'];
    sortBy?: InputMaybe<Array<SubscriptionsSort> | SubscriptionsSort>;
    filterBy?: InputMaybe<
        | Array<Array<Scalars['String']> | Scalars['String']>
        | Array<Scalars['String']>
        | Scalars['String']
    >;
}>;

export type SubscriptionGridQuery = {
    __typename?: 'Query';
    subscriptions: {
        __typename?: 'MyBaseSubscriptionConnection';
        edges: Array<{
            __typename?: 'MyBaseSubscriptionEdge';
            node:
                | {
                      __typename?: 'AggregatedServicePortSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'CorelinkSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'FirewallSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'IpBgpSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'IpPeerGroupSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'IpPeerPortSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'IpPeerSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'IpPrefixSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'IpStaticSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'IrbServicePortSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'L2VpnSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'L3VpnSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'LightPathRedundantSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'LightPathSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'MscSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'NodeSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'NsiLightPathSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'NsiStpSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'PortSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'SurfWirelessSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  }
                | {
                      __typename?: 'UnknownSubscription';
                      note?: string | null;
                      name?: string | null;
                      startDate?: string | null;
                      endDate?: string | null;
                      tag?: string | null;
                      vlanRange?: string | null;
                      description: string;
                      insync: boolean;
                      status: string;
                      subscriptionId: any;
                      product: {
                          __typename?: 'Product';
                          name: string;
                          type: string;
                          tag?: string | null;
                      };
                      organisation?: {
                          __typename?: 'CrmOrganisation';
                          abbreviation?: string | null;
                          name?: string | null;
                      } | null;
                  };
        }>;
    };
};

export const GetSubscriptionDetailOutlineDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetSubscriptionDetailOutline' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'id' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ID' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'subscription' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'subscriptionId',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'customerId' },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'description',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'fixedInputs',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'insync' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'note' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'product' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'name',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'status',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'endDate',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'tag',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'type',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'endDate' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'startDate' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'organisation',
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'abbreviation',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'name',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'website',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'tel',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'productBlocks',
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'id',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'ownerSubscriptionId',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'parent',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'resourceTypes',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetSubscriptionDetailOutlineQuery,
    GetSubscriptionDetailOutlineQueryVariables
>;
export const GetSubscriptionDetailCompleteDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetSubscriptionDetailComplete' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'id' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ID' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'subscription' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'subscriptionId',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'customerId' },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'description',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'fixedInputs',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'insync' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'note' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'product' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'name',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'status',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'endDate',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'tag',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'type',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'endDate' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'startDate' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'organisation',
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'abbreviation',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'name',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'website',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'tel',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'productBlocks',
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'id',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'ownerSubscriptionId',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'parent',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'resourceTypes',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'imsCircuits',
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'ims',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'product',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'speed',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'extraInfo',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'endpoints',
                                                            },
                                                            arguments: [
                                                                {
                                                                    kind: 'Argument',
                                                                    name: {
                                                                        kind: 'Name',
                                                                        value: 'type',
                                                                    },
                                                                    value: {
                                                                        kind: 'EnumValue',
                                                                        value: 'PORT',
                                                                    },
                                                                },
                                                            ],
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'type',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition:
                                                                            {
                                                                                kind: 'NamedType',
                                                                                name: {
                                                                                    kind: 'Name',
                                                                                    value: 'ImsPort',
                                                                                },
                                                                            },
                                                                        selectionSet:
                                                                            {
                                                                                kind: 'SelectionSet',
                                                                                selections:
                                                                                    [
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'id',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'lineName',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'fiberType',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'ifaceType',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'patchposition',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'port',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'status',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'node',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'type',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'vlanranges',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'connectorType',
                                                                                            },
                                                                                        },
                                                                                    ],
                                                                            },
                                                                    },
                                                                    {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition:
                                                                            {
                                                                                kind: 'NamedType',
                                                                                name: {
                                                                                    kind: 'Name',
                                                                                    value: 'ImsInternalPort',
                                                                                },
                                                                            },
                                                                        selectionSet:
                                                                            {
                                                                                kind: 'SelectionSet',
                                                                                selections:
                                                                                    [
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'id',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'lineName',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'node',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'port',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'type',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'vlanranges',
                                                                                            },
                                                                                        },
                                                                                    ],
                                                                            },
                                                                    },
                                                                    {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition:
                                                                            {
                                                                                kind: 'NamedType',
                                                                                name: {
                                                                                    kind: 'Name',
                                                                                    value: 'ImsService',
                                                                                },
                                                                            },
                                                                        selectionSet:
                                                                            {
                                                                                kind: 'SelectionSet',
                                                                                selections:
                                                                                    [
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'id',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'type',
                                                                                            },
                                                                                        },
                                                                                        {
                                                                                            kind: 'Field',
                                                                                            name: {
                                                                                                kind: 'Name',
                                                                                                value: 'vlanranges',
                                                                                            },
                                                                                        },
                                                                                    ],
                                                                            },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'vlanranges',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'location',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetSubscriptionDetailCompleteQuery,
    GetSubscriptionDetailCompleteQueryVariables
>;
export const SubscriptionGridDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'SubscriptionGrid' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'first' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Int' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'after' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Int' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'sortBy' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'SubscriptionsSort',
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'filterBy' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'ListType',
                                type: {
                                    kind: 'NonNullType',
                                    type: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'String' },
                                    },
                                },
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'subscriptions' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'first' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'after' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'sortBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'sortBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'filterBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'filterBy' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'node',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'note',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'startDate',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'endDate',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'tag',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'vlanRange',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'description',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'product',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'type',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tag',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'organisation',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'abbreviation',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'insync',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'status',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'subscriptionId',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    SubscriptionGridQuery,
    SubscriptionGridQueryVariables
>;
