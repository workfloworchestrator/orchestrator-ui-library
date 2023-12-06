import {
    ImpactLevel,
    ImpactLevelFromApi,
    ImpactedCustomerRelation,
    ImpactedCustomersTableColumns,
    ImpactedObject,
    MinlObjectFromApi,
    ServiceTicketProcessState,
} from '../../types';

export const abortEnabledValues: ServiceTicketProcessState[] = [
    ServiceTicketProcessState.OPEN_RELATED,
    ServiceTicketProcessState.OPEN_ACCEPTED,
    ServiceTicketProcessState.OPEN,
];

const impactLevelPriority = [
    ImpactLevel.NO_IMPACT,
    ImpactLevel.REDUCED_REDUNDANCY,
    ImpactLevel.RESILIENCE_LOSS,
    ImpactLevel.DOWN,
];

export const getImpactedObjectPriority = (impact: ImpactLevel) => {
    return impactLevelPriority.indexOf(impact);
};

export const convertApiToUiImpactLevel = (
    apiImpactLevel?: ImpactLevelFromApi,
) => {
    switch (apiImpactLevel) {
        case ImpactLevelFromApi.NO_IMPACT:
            return ImpactLevel.NO_IMPACT;
        case ImpactLevelFromApi.REDUCED_REDUNDANCY:
            return ImpactLevel.REDUCED_REDUNDANCY;
        case ImpactLevelFromApi.RESILIENCE_LOSS:
            return ImpactLevel.RESILIENCE_LOSS;
        case ImpactLevelFromApi.DOWN:
            return ImpactLevel.DOWN;
        default:
            return null;
    }
};

export const getMinlForCustomer = (
    customerId: string,
    apiMinl: MinlObjectFromApi[],
) => {
    const impact = apiMinl.find((m) => m.customer_id === customerId)?.impact;
    return convertApiToUiImpactLevel(impact);
};

export const calculateInformCustomer = (
    sendingLevel: ImpactLevel,
    acceptedImpact: ImpactLevel,
) => {
    return (
        getImpactedObjectPriority(acceptedImpact) >=
        getImpactedObjectPriority(sendingLevel)
    );
};

export const calculateSendingLevel = (
    minimalImpactLevel: ImpactLevel | null,
    defaultSendingLevel: ImpactLevel,
) => {
    return minimalImpactLevel ? minimalImpactLevel : defaultSendingLevel;
};

//TODO: Get the highest impact of all impacted objects
export const getImsCalculatedImpact = (object: ImpactedObject) => {
    // Get the highest impact level from object.ims_circuits. ImpactLevel.NO_IMPACT is the lowest possible impact level. ImpactLevel.DOWN is the highest possible impact level.
    // Compare them with the following order: ImpactLevel.NO_IMPACT < ImpactLevel.REDUCED_REDUNDANCY < ImpactLevel.RESILIENCE_LOSS < ImpactLevel.DOWN
    // if there are two circuits the one with the highest impact level is the one that will be returned
    return object.ims_circuits[object.ims_circuits.length - 1].impact;
};

export const mapImpactedObjectToImpactedCustomersColumns = (
    impactedObject: ImpactedObject,
    minlObjectFromApi: MinlObjectFromApi[],
    cimDefaultSendingLevel: ImpactLevel,
) => {
    const customerTableColumns: ImpactedCustomersTableColumns[] = [];

    const allCustomers = [
        {
            customer: impactedObject.owner_customer,
            relation: ImpactedCustomerRelation.OWNER,
            contacts: impactedObject.owner_customer_contacts,
        },
        ...impactedObject.related_customers.map((object) => ({
            customer: object.customer,
            relation: ImpactedCustomerRelation.RELATED,
            contacts: object.contacts,
        })),
    ];

    allCustomers.map((object) => {
        const acceptedImpact =
            impactedObject.impact_override ??
            getImsCalculatedImpact(impactedObject);
        const customerMinl = getMinlForCustomer(
            object.customer.customer_id,
            minlObjectFromApi,
        );
        const sendingLevel = calculateSendingLevel(
            customerMinl,
            cimDefaultSendingLevel,
        );
        const informCustomer = calculateInformCustomer(
            sendingLevel,
            acceptedImpact,
        );

        customerTableColumns.push({
            customer: object.customer,
            relation: object.relation,
            contacts: object.contacts,
            acceptedImpact: acceptedImpact,
            minl: customerMinl,
            sendingLevel: sendingLevel,
            informCustomer: informCustomer,
        });
    });

    return customerTableColumns;
};
