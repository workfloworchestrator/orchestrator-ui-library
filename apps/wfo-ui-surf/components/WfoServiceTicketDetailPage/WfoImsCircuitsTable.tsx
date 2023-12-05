import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiText } from '@elastic/eui';
import {
    WfoBasicTable,
    WfoTableColumns,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { ServiceTicketImpactedIMSCircuit } from '../../types';

interface WfoImpactedCustomersTableProps {
    imsCircuits: ServiceTicketImpactedIMSCircuit[];
}

export const WfoImsCircuitsTable = ({
    imsCircuits,
}: WfoImpactedCustomersTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactCustomerTable',
    );
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const imsCircuitsTableColumns: WfoTableColumns<ServiceTicketImpactedIMSCircuit> =
        {
            // Ims table columns here. See WfoTableColumns type for more info about the columns and ServiceTicketImpactedIMSCircuit for the data type
            ims_circuit_id: {
                field: 'ims_circuit_id',
                name: t('imsCircuitId'),
                width: '5%',
                render: (value) => (
                    <EuiText color={theme.colors.primary} size={'xs'}>
                        <b>{value}</b>
                    </EuiText>
                ),
            },
            ims_circuit_name: {
                field: 'ims_circuit_name',
                name: t('imsCircuitName'),
                width: '40%',
                render: (value) => <EuiText size={'xs'}>{value}</EuiText>,
            },
            extra_information: {
                field: 'extra_information',
                name: t('extraInformation'),
                width: '40%',
                render: (value) => <EuiText size={'xs'}>{value}</EuiText>,
            },
            impact: {
                field: 'impact',
                name: t('impact'),
                width: '5%',
                render: (value) => <EuiText size={'xs'}>{value}</EuiText>,
            },
        };

    return (
        <>
            <WfoBasicTable
                data={imsCircuits}
                columns={imsCircuitsTableColumns}
            />
        </>
    );
};
