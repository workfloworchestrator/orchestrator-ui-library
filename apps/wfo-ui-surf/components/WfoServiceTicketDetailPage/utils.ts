import {
    ImpactLevel,
    ImpactLevelFromApi,
    ImpactedCustomerRelation,
    ImpactedCustomersTableColumns,
    ImpactedCustomersTableData,
    ImpactedObject,
    ServiceTicketProcessState,
} from '@/types';

export const abortEnabledValues: ServiceTicketProcessState[] = [
    ServiceTicketProcessState.OPEN_RELATED,
    ServiceTicketProcessState.OPEN_ACCEPTED,
    ServiceTicketProcessState.OPEN,
];

export const acceptImpactEnabledValues: ServiceTicketProcessState[] = [
    ServiceTicketProcessState.OPEN_RELATED,
    ServiceTicketProcessState.OPEN_ACCEPTED,
];

const impactLevelPriority = [
    ImpactLevel.NEVER,
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
        case ImpactLevelFromApi.NEVER:
            return ImpactLevel.NEVER;
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
    apiMinl: ImpactLevelFromApi,
) => {
    return convertApiToUiImpactLevel(apiMinl);
};

export const calculateInformCustomer = (
    sendingLevel: ImpactLevel,
    acceptedImpact: ImpactLevel,
): boolean => {
    return (
        getImpactedObjectPriority(acceptedImpact) >=
        getImpactedObjectPriority(sendingLevel)
    );
};

export const calculateSendingLevel = (
    minimalImpactLevel: ImpactLevel | null,
    defaultSendingLevel: ImpactLevel,
) => {
    return minimalImpactLevel ?? defaultSendingLevel;
};

export const getImsCalculatedImpact = (object: ImpactedObject) => {
    const { ims_circuits } = object;

    return ims_circuits.reduce((highest, current) => {
        const highestIndex = impactLevelPriority.indexOf(highest);
        const currentIndex = impactLevelPriority.indexOf(current.impact);
        return currentIndex > highestIndex ? current.impact : highest;
    }, ims_circuits[0].impact);
};

export const getImpactedCustomersTableData = (
    impactedObject: ImpactedObject,
    cimDefaultSendingLevel: ImpactLevel,
): ImpactedCustomersTableData => {
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
            object.customer.customer_minl,
        );
        const sendingLevel = calculateSendingLevel(
            customerMinl,
            cimDefaultSendingLevel,
        );
        const informCustomer: boolean = calculateInformCustomer(
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
    const informCustomersCount = customerTableColumns.filter(
        (column) => column.informCustomer,
    ).length;
    return {
        columns: customerTableColumns,
        informCustomers: informCustomersCount,
        imsCircuits: impactedObject.ims_circuits,
    };
};
