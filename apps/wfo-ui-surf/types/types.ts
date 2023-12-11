/** CIM */
import { ReactNode } from 'react';

import { Process } from '@orchestrator-ui/orchestrator-ui-components';

export enum WfoServiceTicketListTabType {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

export interface CreateServiceTicketPayload {
    ims_pw_id: string;
    jira_ticket_id: string;
    title_nl: string;
    type: ServiceTicketType;
}

export interface OpenServiceTicketPayload {
    cim_ticket_id: string;
    title_nl: string;
    description_nl: string;
    title_en: string;
    description_en: string;
    mail_subject: string;
}

export interface UpdateServiceTicketPayload extends OpenServiceTicketPayload {
    start_date?: string;
    end_date?: string;
}

export interface CloseServiceTicketPayload extends OpenServiceTicketPayload {
    end_date?: string;
}

export enum ServiceTicketProcessState {
    NEW = 'new',
    OPEN = 'open',
    OPEN_RELATED = 'open_related',
    OPEN_ACCEPTED = 'open_accepted',
    UPDATED = 'updated',
    ABORTED = 'aborted',
    CLOSED = 'closed',
}

export enum ServiceTicketTransition {
    RELATING = 'relating',
    ACCEPTING = 'accepting',
    ABORTING = 'aborting',
    OPENING = 'opening',
    OPEN_AND_CLOSE = 'open_and_close',
    UPDATING = 'updating',
    CLOSING = 'closing',
    CLEANING = 'cleaning',
}

export type ServiceTicketDefinition = {
    _id: string;
    statusColorField?: string;
    jira_ticket_id: string;
    opened_by: string;
    process_state: ServiceTicketProcessState;
    start_date: string;
    create_date: string;
    last_update_time: string;
    title_nl: string;
};

export type ServiceTicketListItem = Pick<
    Process,
    | 'workflowName'
    | 'lastStep'
    | 'lastStatus'
    | 'workflowTarget'
    | 'createdBy'
    | 'assignee'
    | 'processId'
    | 'subscriptions'
> & {
    startedAt: Date;
    lastModifiedAt: Date;
    productName?: string;
    productTag?: string;
    customer: string;
    customerAbbreviation: string;
};

export enum ServiceTicketLogType {
    OPEN = 'open',
    UPDATE = 'update',
    CLOSE = 'close',
}

export interface ServiceTicketLog {
    entry_time: string;
    update_nl: string;
    update_en: string;
    log_type: ServiceTicketLogType;
    logged_by: string;
    transition: ServiceTicketTransition;
    completed: boolean;
}

export enum ImpactLevel {
    NO_IMPACT = 'no_impact',
    REDUCED_REDUNDANCY = 'reduced_redundancy',
    RESILIENCE_LOSS = 'resilience_loss',
    DOWN = 'down',
}

export enum ImpactLevelFromApi {
    NO_IMPACT = 'No Impact',
    REDUCED_REDUNDANCY = 'Reduced Redundancy',
    RESILIENCE_LOSS = 'Lost Resiliency',
    DOWN = 'Downtime',
}

export interface ServiceTicketImpactedIMSCircuit {
    ims_circuit_id: number;
    ims_circuit_name: string;
    impact: ImpactLevel;
    extra_information?: string;
}

export interface ImpactedCustomer {
    customer_id: string;
    customer_name: string;
    customer_abbrev: string;
}
export interface ServiceTicketBackgroundJobCount {
    number_of_active_jobs: number;
}

export interface ImpactedCustomerContact {
    name: string;
    email: string;
}

export interface ImpactedRelatedCustomer {
    customer: ImpactedCustomer;
    customer_subscription_description?: string;
    contacts: ImpactedCustomerContact[];
}

export interface ImpactedObject {
    impact_override: ImpactLevel;
    subscription_id: string | null;
    product_type: string;
    logged_by: string;
    ims_circuits: ServiceTicketImpactedIMSCircuit[];
    owner_customer: ImpactedCustomer;
    subscription_description: string;
    owner_customer_description?: string;
    owner_customer_contacts: ImpactedCustomerContact[];
    related_customers: ImpactedRelatedCustomer[];
}

export type ImpactTableColumns = Pick<
    ImpactedObject,
    'subscription_id' | 'subscription_description' | 'impact_override'
> & {
    affectedCustomers: number; //think about 0 or null
    informCustomers: string;
    imsCalculatedImpact: ImpactLevel;
    setImpactOverride: boolean;
};

export enum ImpactedCustomerRelation {
    OWNER = 'owner',
    RELATED = 'related',
    PORT_RELATED = 'port related',
    GRANTED_PERMISSION = 'granted permission',
}

export enum ServiceTicketType {
    PLANNED_WORK = 'planned work',
    INCIDENT = 'incident',
}

export interface BackgroundJobLog {
    message: string;
    customer_id?: string;
    subscription_id?: string;
    entry_time: string;
    process_state: string;
    context: object;
}

export interface Email {
    customer: ImpactedCustomer;
    message: string;
    to: ImpactedCustomerContact[];
    cc: ImpactedCustomerContact[];
    bcc: ImpactedCustomerContact[];
    language: string;
}

export interface EmailLog {
    entry_time: string;
    log_type: string;
}

export interface ServiceTicketWithDetails extends ServiceTicketDefinition {
    ims_pw_id: string;
    end_date: string;
    last_update_time: string;
    type: ServiceTicketType;
    logs: ServiceTicketLog[];
    impacted_objects: ImpactedObject[];
    background_logs: BackgroundJobLog[];
    email_logs: EmailLog[];
}

export interface ImsInfo {
    impact: ImpactLevel;
    ims_circuit_id: number;
    ims_circuit_name: string;
    extra_information?: string;
}

export enum Locale {
    enUS = 'en-GB',
    nlNL = 'nl-NL',
}

export enum ServiceTicketTabIds {
    GENERAL_TAB = 'general-id',
    NOTIFICATION_LOG = 'notification-log-id',
    SENT_EMAILS = 'sent-emails-id',
}

export interface ServiceTicketDetailPageTab {
    id: ServiceTicketTabIds;
    translationKey: string;
    prepend?: ReactNode;
    append?: ReactNode;
}

export interface MinlObjectFromApi {
    created_at: number;
    customer_id: string;
    id: string;
    impact: ImpactLevelFromApi;
    last_modified: number;
    subscription_id: string;
}

export type ImpactedObjectWithIndex = {
    item: ImpactTableColumns;
    index: number;
};

export type ImpactedCustomersTableColumns = {
    customer: ImpactedCustomer;
    relation: ImpactedCustomerRelation;
    contacts: ImpactedCustomerContact[];
    acceptedImpact: ImpactLevel;
    minl: ImpactLevel | null;
    sendingLevel: ImpactLevel;
    informCustomer: boolean;
};

export type CustomerWithContacts = {
    name: string;
    contacts: ImpactedCustomerContact[];
};
