import {
    ServiceTicketApiImpactLevel,
    ServiceTicketImpactedObjectImpact,
    ServiceTicketProcessState,
} from '../../types';

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

export const mapApiImpactLevelsToUI = (
    apiImpactLevel?: ServiceTicketApiImpactLevel,
) => {
    switch (apiImpactLevel) {
        case ServiceTicketApiImpactLevel.NO_IMPACT:
            return ServiceTicketImpactedObjectImpact.NO_IMPACT;
        case ServiceTicketApiImpactLevel.REDUCED_REDUNDANCY:
            return ServiceTicketImpactedObjectImpact.REDUCED_REDUNDANCY;
        case ServiceTicketApiImpactLevel.RESILIENCE_LOSS:
            return ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS;
        case ServiceTicketApiImpactLevel.DOWN:
            return ServiceTicketImpactedObjectImpact.DOWN;
        default:
            return '';
    }
};
