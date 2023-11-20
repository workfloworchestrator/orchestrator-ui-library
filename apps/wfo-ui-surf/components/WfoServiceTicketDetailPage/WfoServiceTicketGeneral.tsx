import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';
import {
    SubscriptionKeyValueBlock,
    WfoKeyValueTableDataType,
    formatDate,
} from '@orchestrator-ui/orchestrator-ui-components';

import { ServiceTicketWithDetails } from '../../types';
import { WfoServiceTicketStatusBadge } from '../WfoBadges/WfoServiceTicketStatusBadge';

interface WfoSubscriptionGeneralProps {
    serviceTicketGeneral: ServiceTicketWithDetails;
}

export const WfoServiceTicketGeneral = ({
    serviceTicketGeneral,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations('cim.serviceTickets.detail.tabDetails.general');

    const getSubscriptionDetailBlockData = (): WfoKeyValueTableDataType[] => {
        return [
            {
                key: t('serviceTicketTitle'),
                value: serviceTicketGeneral.title_nl,
                textToCopy: serviceTicketGeneral.title_nl,
            },
            {
                key: t('jiraTicketId'),
                value: serviceTicketGeneral.jira_ticket_id,
            },
            {
                key: t('imsPlannedWork'),
                value: serviceTicketGeneral.ims_pw_id,
            },
            {
                key: t('type'),
                value: serviceTicketGeneral.type,
            },
            {
                key: t('startDate'),
                value: formatDate(serviceTicketGeneral.last_update_time),
            },
            {
                key: t('endDate'),
                value: formatDate(serviceTicketGeneral.last_update_time),
            },
            {
                key: t('openedBy'),
                value: serviceTicketGeneral.opened_by,
            },
            {
                key: t('createDate'),
                value: formatDate(serviceTicketGeneral.create_date),
            },
            {
                key: t('lastUpdateTime'),
                value: formatDate(serviceTicketGeneral.last_update_time),
            },
            {
                key: t('processState'),
                value: (
                    <WfoServiceTicketStatusBadge
                        serviceTicketState={serviceTicketGeneral.process_state}
                    />
                ),
            },
        ];
    };

    return (
        <EuiFlexGrid direction={'row'}>
            <>
                <EuiFlexItem>
                    <SubscriptionKeyValueBlock
                        title={t('title')}
                        keyValues={getSubscriptionDetailBlockData()}
                    />
                </EuiFlexItem>
            </>
        </EuiFlexGrid>
    );
};
