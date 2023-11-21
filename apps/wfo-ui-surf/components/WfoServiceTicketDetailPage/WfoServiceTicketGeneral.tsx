import React, { useContext, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButtonIcon,
    EuiFlexGrid,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import {
    SubscriptionKeyValueBlock,
    WfoBadge,
    WfoInformationModal,
    WfoKeyValueTableDataType,
    formatDate,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';
import { WfoStatistic } from '@orchestrator-ui/orchestrator-ui-components';

import { SurfConfigContext } from '../../contexts/surfConfigContext';
import { ServiceTicketWithDetails } from '../../types';
import { WfoServiceTicketStatusBadge } from '../WfoBadges/WfoServiceTicketStatusBadge';
import { WfoSubscriptionImpactTable } from './WfoSubscriptionImpactTable';

interface WfoSubscriptionGeneralProps {
    serviceTicketGeneral: ServiceTicketWithDetails;
}

export const WfoServiceTicketGeneral = ({
    serviceTicketGeneral,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations('cim.serviceTickets.detail.tabDetails.general');
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    const { cimDefaultSendingLevel } = useContext(SurfConfigContext);
    const [defaultSendingLevelModalIsOpen, setDefaultSendingLevelModalIsOpen] =
        useState(false);

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
        <>
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
            <EuiSpacer />
            <EuiFlexGroup gutterSize={'xs'}>
                <EuiFlexItem
                    grow={false}
                    style={{ paddingRight: theme.size.xxl }}
                >
                    <EuiText
                        grow={false}
                        css={{ fontWeight: theme.font.weight.semiBold }}
                    >
                        {t('defaultSendingLevel')}
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <WfoBadge
                        textColor={theme.colors.warningText}
                        color={toSecondaryColor(theme.colors.warning)}
                    >
                        <EuiText>
                            <b>{cimDefaultSendingLevel}</b>
                        </EuiText>
                    </WfoBadge>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                        onClick={() => setDefaultSendingLevelModalIsOpen(true)}
                        iconSize={'l'}
                        iconType={'iInCircle'}
                        style={{ marginTop: theme.size.xxs }}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
            {defaultSendingLevelModalIsOpen && (
                <WfoInformationModal
                    title={t('defaultSendingLevelModalTitle')}
                    onClose={() => setDefaultSendingLevelModalIsOpen(false)}
                >
                    <EuiText>
                        <p>{t('defaultSendingLevelModalText')}</p>
                    </EuiText>
                </WfoInformationModal>
            )}
            <EuiSpacer size={'xxl'} />
            <EuiFlexGroup gutterSize={'s'}>
                <EuiFlexItem grow={false}>
                    <WfoStatistic color={theme.colors.primaryText} />
                </EuiFlexItem>
                <EuiFlexItem
                    grow={false}
                    style={{ paddingRight: theme.size.xxl }}
                >
                    <EuiText
                        grow={false}
                        css={{ fontWeight: theme.font.weight.semiBold }}
                    >
                        {t('impactOnSubscriptions')}
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size={'m'} />
            <WfoSubscriptionImpactTable />
        </>
    );
};
