import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';

import { EuiText } from '@elastic/eui';
import {
    WfoBadge,
    WfoDropdownTable,
    WfoTableColumns,
    useFilterQueryWithRest,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { MINL_BY_SUBSCRIPTION_ENDPOINT } from '../../constants-surf';
import { SurfConfigContext } from '../../contexts/surfConfigContext';
import {
    MinimalImpactNotificationLevel,
    ServiceTicketApiImpactLevel,
    ServiceTicketCustomerRelation,
    ServiceTicketDefinition,
    ServiceTicketImpactedObject,
    ServiceTicketImpactedObjectImpact,
    SubscriptionImpactCustomerTableColumns,
} from '../../types';
import { mapApiImpactLevelsToUI } from './utils';

interface WfoSubscriptionImpactCustomerTableProps {
    impactedObject: ServiceTicketImpactedObject;
}

// const defaultTableStyle = css({
//     '.euiTableCellContent__text': {
//         display: 'flex',
//     },
// });

export const WfoSubscriptionImpactCustomerTable = ({
    impactedObject,
}: WfoSubscriptionImpactCustomerTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactCustomerTable',
    );
    const { cimDefaultSendingLevel } = useContext(SurfConfigContext);
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const { data: minl, isFetching } =
        useFilterQueryWithRest<ServiceTicketDefinition>(
            MINL_BY_SUBSCRIPTION_ENDPOINT + impactedObject.subscription_id,
            ['minl', impactedObject.subscription_id ?? ''],
        );

    const getMinlForUi = (
        customerId: string,
        minl: MinimalImpactNotificationLevel[],
    ) => {
        const impact: ServiceTicketApiImpactLevel | undefined = minl.find(
            (m) => m.customer_id === customerId,
        )?.impact;
        return mapApiImpactLevelsToUI(impact);
    };

    const calculateSendingLevel = (
        acceptedImpact: ServiceTicketImpactedObjectImpact,
        minl: ServiceTicketImpactedObjectImpact,
    ) => {
        if (minl) {
            return acceptedImpact >= minl ? acceptedImpact : minl;
        } else {
            return cimDefaultSendingLevel;
        }
    };

    const calculateInformCustomer = (
        sendingLevel: ServiceTicketImpactedObjectImpact,
        acceptedImpact: ServiceTicketImpactedObjectImpact,
    ) => {
        return acceptedImpact >= sendingLevel;
    };

    const mapImpactedObjectToTableColumns = (
        impactedObject: ServiceTicketImpactedObject,
    ) => {
        const customerTableColumns: SubscriptionImpactCustomerTableColumns[] =
            [];
        const acceptedImpact =
            impactedObject.ims_circuits[impactedObject.ims_circuits.length - 1]
                .impact ?? '';
        const firstMinl = getMinlForUi(
            impactedObject.owner_customer.customer_id,
            minl,
        );
        const sendingLevel = calculateSendingLevel(acceptedImpact, firstMinl);

        customerTableColumns.push({
            customer: impactedObject.owner_customer.customer_abbrev,
            relation: ServiceTicketCustomerRelation.OWNER,
            contacts: impactedObject.owner_customer_contacts.length ?? 0,
            acceptedImpact: acceptedImpact,
            minl: getMinlForUi(impactedObject.owner_customer.customer_id, minl),
            sendingLevel: sendingLevel,
            informCustomer: calculateInformCustomer(
                sendingLevel,
                acceptedImpact,
            ),
        });

        impactedObject.related_customers.forEach((object) => {
            const acceptedImpact =
                impactedObject.ims_circuits[
                    impactedObject.ims_circuits.length - 1
                ].impact ?? '';
            const secondMinl = getMinlForUi(object.customer.customer_id, minl);
            const sendingLevel = calculateSendingLevel(
                acceptedImpact,
                secondMinl,
            );

            customerTableColumns.push({
                customer: object.customer.customer_abbrev,
                relation: ServiceTicketCustomerRelation.RELATED,
                contacts: object.contacts.length ?? 0,
                acceptedImpact: acceptedImpact,
                minl: secondMinl,
                sendingLevel: sendingLevel,
                informCustomer: calculateInformCustomer(
                    sendingLevel,
                    acceptedImpact,
                ),
            });
        });

        return customerTableColumns;
    };

    // const data: SubscriptionImpactCustomerTableColumns[] = [
    //     {
    //         customer: {
    //             customer_abbrev: 'KNAW',
    //             customer_name:
    //                 'Koninklijke Nederlandse Akademie van Wetenschappen',
    //             customer_id: '1',
    //         },
    //         relation: 'owner',
    //         contacts: 2,
    //         acceptedImpact: ServiceTicketImpactedObjectImpact.DOWN,
    //         minl: ServiceTicketImpactedObjectImpact.REDUCED_REDUNDANCY,
    //         sendingLevel: ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
    //         informCustomer: true,
    //     },
    //     {
    //         customer: {
    //             customer_abbrev: 'SURFnfv',
    //             customer_name:
    //                 'Stichting SURFnet netwerkfuncties virtualisatie',
    //             customer_id: '1',
    //         },
    //         relation: 'related',
    //         contacts: 3,
    //         acceptedImpact: ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
    //         minl: ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
    //         sendingLevel: ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
    //         informCustomer: false,
    //     },
    // ];

    const impactCustomerTableColumns: WfoTableColumns<SubscriptionImpactCustomerTableColumns> =
        {
            customer: {
                name: t('customers'),
                field: 'customer',
                render: (customer) => (
                    <EuiText>
                        <b>{customer}</b>
                    </EuiText>
                ),
            },
            relation: {
                field: 'relation',
                name: t('relation'),
            },
            contacts: {
                field: 'contacts',
                name: t('contacts'),
            },
            acceptedImpact: {
                field: 'acceptedImpact',
                name: t('acceptedImpact'),
                render: (value) => (
                    <WfoBadge
                        textColor={theme.colors.warningText}
                        color={toSecondaryColor(theme.colors.warning)}
                    >
                        {value}
                    </WfoBadge>
                ),
            },
            minl: {
                field: 'minl',
                name: t('minl'),
                render: (value) => (
                    <WfoBadge
                        textColor={theme.colors.warningText}
                        color={toSecondaryColor(theme.colors.warning)}
                    >
                        {value}
                    </WfoBadge>
                ),
            },
            sendingLevel: {
                field: 'sendingLevel',
                name: t('sendingLevel'),
                render: (value) => (
                    <WfoBadge
                        textColor={theme.colors.warningText}
                        color={toSecondaryColor(theme.colors.warning)}
                    >
                        {value}
                    </WfoBadge>
                ),
            },
            informCustomer: {
                field: 'informCustomer',
                name: t('informCustomer'),
            },
        };

    return (
        <WfoDropdownTable
            data={
                impactedObject && minl
                    ? mapImpactedObjectToTableColumns(impactedObject)
                    : []
            }
            columns={impactCustomerTableColumns}
        />
    );
};
