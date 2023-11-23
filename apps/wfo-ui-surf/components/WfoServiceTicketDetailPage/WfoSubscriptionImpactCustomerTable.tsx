import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';

import { EuiIcon, EuiText } from '@elastic/eui';
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
    ServiceTicketCustomerRelation,
    ServiceTicketDefinition,
    ServiceTicketImpactedObject,
    SubscriptionImpactCustomerTableColumns,
} from '../../types';
import {
    calculateInformCustomer,
    calculateSendingLevel,
    getImsCalculatedImpact,
    getMinlValueForUi,
    mapImpactedObjectToCustomerTableColumns,
} from './utils';

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

    const { data: minlObjectFromApi, isFetching } =
        useFilterQueryWithRest<ServiceTicketDefinition>(
            MINL_BY_SUBSCRIPTION_ENDPOINT + impactedObject.subscription_id,
            ['minl', impactedObject.subscription_id ?? ''],
        );

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
                render: (value) =>
                    value && (
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
                render: (value) => (
                    <EuiIcon
                        type={value ? 'check' : 'cross'}
                        color={value ? 'success' : 'danger'}
                        size="l"
                    />
                ),
            },
        };

    return (
        <WfoDropdownTable
            data={
                impactedObject && minlObjectFromApi
                    ? mapImpactedObjectToCustomerTableColumns(
                          impactedObject,
                          minlObjectFromApi,
                          cimDefaultSendingLevel,
                      )
                    : []
            }
            isLoading={isFetching}
            columns={impactCustomerTableColumns}
        />
    );
};
