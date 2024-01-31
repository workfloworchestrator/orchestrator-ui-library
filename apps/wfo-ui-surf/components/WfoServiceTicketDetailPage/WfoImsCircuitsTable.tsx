import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';

import { EuiLink, EuiText } from '@elastic/eui';
import {
    WfoBasicTable,
    WfoTableColumns,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { SurfConfigContext } from '@/contexts/SurfConfigContext';
import { IMSCircuit } from '@/types';

interface WfoImpactedCustomersTableProps {
    imsCircuits: IMSCircuit[];
}

export const WfoImsCircuitsTable = ({
    imsCircuits,
}: WfoImpactedCustomersTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactCustomerTable',
    );
    const { theme } = useOrchestratorTheme();
    const { imsBaseUrl } = useContext(SurfConfigContext);
    const imsLink = imsBaseUrl.concat('/form', '/circuit', '/');

    const imsCircuitsTableColumns: WfoTableColumns<IMSCircuit> = {
        ims_circuit_id: {
            field: 'ims_circuit_id',
            name: t('imsCircuitId'),
            width: '5%',
            render: (value) => (
                <EuiText color={theme.colors.primary} size={'xs'}>
                    <EuiLink href={imsLink + value}>
                        <b>{value}</b>
                    </EuiLink>
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
