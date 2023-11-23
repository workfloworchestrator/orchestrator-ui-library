import { useContext } from 'react';

import { SurfConfigContext } from '../../contexts/surfConfigContext';
import {
    MinimalImpactNotificationLevel,
    ServiceTicketApiImpactLevel,
    ServiceTicketCustomerRelation,
    ServiceTicketImpactedObject,
    ServiceTicketImpactedObjectColumns,
    ServiceTicketImpactedObjectImpact,
    ServiceTicketProcessState,
    SubscriptionImpactCustomerTableColumns,
} from '../../types';

export const abortEnabledValues: ServiceTicketProcessState[] = [
    ServiceTicketProcessState.OPEN_RELATED,
    ServiceTicketProcessState.OPEN_ACCEPTED,
    ServiceTicketProcessState.OPEN,
];

const impactedObjectPriority = [
    ServiceTicketImpactedObjectImpact.NO_IMPACT,
    ServiceTicketImpactedObjectImpact.REDUCED_REDUNDANCY,
    ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
    ServiceTicketImpactedObjectImpact.DOWN,
];

export const getImpactedObjectPriority = (
    impact: ServiceTicketImpactedObjectImpact,
) => {
    return impactedObjectPriority.indexOf(impact);
};

export const mapApiImpactLevelToUi = (
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

export const getMinlValueForUi = (
    customerId: string,
    minl: MinimalImpactNotificationLevel[],
) => {
    const impact: ServiceTicketApiImpactLevel | undefined = minl.find(
        (m) => m.customer_id === customerId,
    )?.impact;
    return mapApiImpactLevelToUi(impact);
};

export const calculateInformCustomer = (
    sendingLevel: ServiceTicketImpactedObjectImpact,
    acceptedImpact: ServiceTicketImpactedObjectImpact,
) => {
    return (
        getImpactedObjectPriority(acceptedImpact) >=
        getImpactedObjectPriority(sendingLevel)
    );
};

export const calculateSendingLevel = (
    acceptedImpact: ServiceTicketImpactedObjectImpact,
    minl: ServiceTicketImpactedObjectImpact,
    defaultSendingLevel: ServiceTicketImpactedObjectImpact,
) => {
    if (minl) {
        return getImpactedObjectPriority(acceptedImpact) >=
            getImpactedObjectPriority(minl)
            ? acceptedImpact
            : minl;
    }
    return defaultSendingLevel;
};

export const getImsCalculatedImpact = (object: ServiceTicketImpactedObject) => {
    return object.ims_circuits[object.ims_circuits.length - 1].impact;
};

export const mapImpactedObjectToCustomerTableColumns = (
    impactedObject: ServiceTicketImpactedObject,
    minlObjectFromApi: MinimalImpactNotificationLevel,
    cimDefaultSendingLevel: ServiceTicketImpactedObjectImpact,
) => {
    const customerTableColumns: SubscriptionImpactCustomerTableColumns[] = [];

    const allCustomers = [
        {
            customer: impactedObject.owner_customer,
            relation: ServiceTicketCustomerRelation.OWNER,
            contacts: impactedObject.owner_customer_contacts,
        },
        ...impactedObject.related_customers.map((object) => ({
            customer: object.customer,
            relation: ServiceTicketCustomerRelation.RELATED,
            contacts: object.contacts,
        })),
    ];

    allCustomers.map((object) => {
        const acceptedImpact =
            impactedObject.impact_override ??
            getImsCalculatedImpact(impactedObject);

        const customerMinl = getMinlValueForUi(
            object.customer.customer_id,
            minlObjectFromApi,
        );
        const sendingLevel = calculateSendingLevel(
            acceptedImpact,
            customerMinl,
            cimDefaultSendingLevel,
        );
        const informCustomer = calculateInformCustomer(
            sendingLevel,
            acceptedImpact,
        );

        customerTableColumns.push({
            customer: object.customer.customer_abbrev,
            relation: object.relation,
            contacts: object.contacts.length ?? 0,
            acceptedImpact: acceptedImpact,
            minl: customerMinl,
            sendingLevel: sendingLevel,
            informCustomer: informCustomer,
        });
    });

    return customerTableColumns;
};
