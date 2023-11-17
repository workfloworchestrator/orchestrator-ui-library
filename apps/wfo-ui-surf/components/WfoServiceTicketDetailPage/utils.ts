import { ServiceTicketProcessState } from '../../types';

export enum ServiceTicketTabIds {
    GENERAL_TAB = 'general-id',
    NOTIFICATION_LOG = 'notification-log-id',
    SENT_EMAILS = 'sent-emails-id',
}

export const abortEnabledValues: ServiceTicketProcessState[] = [
    ServiceTicketProcessState.OPEN_RELATED,
    ServiceTicketProcessState.OPEN_ACCEPTED,
    ServiceTicketProcessState.OPEN,
];
