import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';

import { EuiIcon, EuiText } from '@elastic/eui';
import {
    WfoBadge,
    WfoCheckmarkCircleFill,
    WfoDropdownTable,
    WfoTableColumns,
    WfoXCircleFill,
    useFilterQueryWithRest,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { MINL_BY_SUBSCRIPTION_ENDPOINT } from '../../constants-surf';
import { SurfConfigContext } from '../../contexts/surfConfigContext';
import {
    ImpactedCustomerRelation,
    ImpactedCustomersTableColumns,
    ImpactedObject,
    ServiceTicketDefinition,
} from '../../types';
import { WfoImpactLevelBadge } from '../WfoBadges/WfoImpactLevelBadge';
import {
    calculateInformCustomer,
    calculateSendingLevel,
    getImsCalculatedImpact,
    getMinlForCustomer,
    mapImpactedObjectToImpactedCustomersColumns,
} from './utils';

interface WfoImpactedCustomersTableProps {
    impactedObject: ImpactedObject;
}

// const defaultTableStyle = css({
//     '.euiTableCellContent__text': {
//         display: 'flex',
//     },
// });

export const WfoImpactedCustomersTable = ({
    impactedObject,
}: WfoImpactedCustomersTableProps) => {
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

    const impactedCustomersTableColumns: WfoTableColumns<ImpactedCustomersTableColumns> =
        {
            customer: {
                name: t('customers'),
                field: 'customer',
                width: '250',
                render: (customer) => (
                    <EuiText size={'s'}>
                        <b>{customer}</b>
                    </EuiText>
                ),
            },
            relation: {
                field: 'relation',
                name: t('relation'),
                render: (value) => (
                    <WfoBadge textColor={theme.colors.darkestShade}>
                        {value}
                    </WfoBadge>
                ),
            },
            contacts: {
                field: 'contacts',
                name: t('contacts'),
            },
            acceptedImpact: {
                field: 'acceptedImpact',
                name: t('acceptedImpact'),
                render: (value) => (
                    <WfoImpactLevelBadge impactedObjectImpact={value} />
                ),
            },
            minl: {
                field: 'minl',
                name: t('minl'),
                width: '250',
                render: (value) =>
                    value && (
                        <WfoImpactLevelBadge impactedObjectImpact={value} />
                    ),
            },
            sendingLevel: {
                field: 'sendingLevel',
                name: t('sendingLevel'),
                render: (value) => (
                    <WfoImpactLevelBadge impactedObjectImpact={value} />
                ),
            },
            informCustomer: {
                field: 'informCustomer',
                name: t('informCustomer'),
                render: (value) =>
                    value ? (
                        <WfoCheckmarkCircleFill
                            width={30}
                            height={30}
                            color={theme.colors.success}
                        />
                    ) : (
                        <WfoXCircleFill
                            width={30}
                            height={30}
                            color={theme.colors.danger}
                        />
                    ),
            },
        };

    return (
        <WfoDropdownTable
            data={
                impactedObject && minlObjectFromApi
                    ? mapImpactedObjectToImpactedCustomersColumns(
                          impactedObject,
                          minlObjectFromApi,
                          cimDefaultSendingLevel,
                      )
                    : []
            }
            isLoading={isFetching}
            columns={impactedCustomersTableColumns}
        />
    );
};
