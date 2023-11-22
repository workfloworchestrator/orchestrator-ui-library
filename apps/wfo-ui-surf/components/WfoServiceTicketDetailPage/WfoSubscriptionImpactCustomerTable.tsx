import {
    WfoDropdownTable,
    WfoTableColumns,
} from '@orchestrator-ui/orchestrator-ui-components';
import React from 'react';
import { EuiText } from '@elastic/eui';
import {
    ServiceTicketImpactedObjectColumns,
    ServiceTicketImpactedObjectImpact,
    SubscriptionImpactCustomerTableColumns,
} from '../../types';
import { useTranslations } from 'next-intl';
import { css } from '@emotion/react';

interface WfoSubscriptionImpactCustomerTableProps {
    impactedObject: ServiceTicketImpactedObjectColumns;
}

const defaultTableStyle = css({
    '.euiTableCellContent__text': {
        display: 'flex',
    },
});

export const WfoSubscriptionImpactCustomerTable = ({
    impactedObject,
}: WfoSubscriptionImpactCustomerTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactCustomerTable',
    );

    const data: SubscriptionImpactCustomerTableColumns[] = [
        {
            customer: {
                customer_abbrev: 'KNAW',
                customer_name:
                    'Koninklijke Nederlandse Akademie van Wetenschappen',
                customer_id: '1',
            },
            relation: 'owner',
            contacts: [{ name: 'John Doe', email: 'john@gmail.com' }],
            acceptedImpact: ServiceTicketImpactedObjectImpact.DOWN,
            minl: ServiceTicketImpactedObjectImpact.REDUCED_REDUNDANCY,
            sendingLevel: ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
            informCustomer: true,
        },
        {
            customer: {
                customer_abbrev: 'SURFnfv',
                customer_name:
                    'Stichting SURFnet netwerkfuncties virtualisatie',
                customer_id: '1',
            },
            relation: 'related',
            contacts: [{ name: 'John Doe', email: 'john@yahoo.com' }],
            acceptedImpact: ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
            minl: ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
            sendingLevel: ServiceTicketImpactedObjectImpact.RESILIENCE_LOSS,
            informCustomer: false,
        },
    ];

    const impactCustomerTableColumns: WfoTableColumns<SubscriptionImpactCustomerTableColumns> =
        {
            customer: {
                name: t('customers'),
                field: 'customer',
                render: (customer) => (
                    <EuiText>
                        <b>{customer.customer_abbrev}</b>
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
            },
            minl: {
                field: 'minl',
                name: t('minl'),
            },
            sendingLevel: {
                field: 'sendingLevel',
                name: t('sendingLevel'),
            },
            informCustomer: {
                field: 'informCustomer',
                name: t('informCustomer'),
            },
        };

    return (
        <WfoDropdownTable
            data={data ? data : []}
            columns={impactCustomerTableColumns}
        />
    );
};
