import React, { useContext, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiButtonIcon,
    EuiFlexGrid,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import {
    SubscriptionKeyValueBlock,
    WfoInformationModal,
    WfoKeyValueTableDataType,
    formatDate,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';
import { WfoStatistic } from '@orchestrator-ui/orchestrator-ui-components';

import { acceptImpactEnabledValues } from '@/components/WfoServiceTicketDetailPage/utils';
import { SurfConfigContext } from '@/contexts/SurfConfigContext';
import { useAcceptImpact } from '@/hooks/modifyResourceHooks';
import { ServiceTicketWithDetails } from '@/types';

import { WfoImpactLevelBadge } from '../WfoBadges/WfoImpactLevelBadge';
import { WfoServiceTicketStatusBadge } from '../WfoBadges/WfoServiceTicketStatusBadge';
import { WfoImpactTable } from './WfoImpactTable';

interface WfoSubscriptionGeneralProps {
    serviceTicketDetail: ServiceTicketWithDetails;
}

export const WfoServiceTicketGeneral = ({
    serviceTicketDetail,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations('cim.serviceTickets.detail.tabDetails.general');
    const { theme } = useOrchestratorTheme();
    const { cimDefaultSendingLevel } = useContext(SurfConfigContext);
    const { mutate } = useAcceptImpact();
    const [defaultSendingLevelModalIsOpen, setDefaultSendingLevelModalIsOpen] =
        useState(false);

    const handleAcceptTicket = () => {
        mutate({
            serviceTicketId: serviceTicketDetail._id,
        });
    };

    const getSubscriptionDetailBlockData = (): WfoKeyValueTableDataType[] => {
        return [
            {
                key: t('serviceTicketTitle'),
                value: serviceTicketDetail.title_nl,
                textToCopy: serviceTicketDetail.title_nl,
            },
            {
                key: t('jiraTicketId'),
                value: serviceTicketDetail.jira_ticket_id,
            },
            {
                key: t('imsPlannedWork'),
                value: serviceTicketDetail.ims_pw_id,
            },
            {
                key: t('type'),
                value: serviceTicketDetail.type,
            },
            {
                key: t('startDate'),
                value: formatDate(serviceTicketDetail.last_update_time),
            },
            {
                key: t('endDate'),
                value: formatDate(serviceTicketDetail.last_update_time),
            },
            {
                key: t('openedBy'),
                value: serviceTicketDetail.opened_by,
            },
            {
                key: t('createDate'),
                value: formatDate(serviceTicketDetail.create_date),
            },
            {
                key: t('lastUpdateTime'),
                value: formatDate(serviceTicketDetail.last_update_time),
            },
            {
                key: t('processState'),
                value: (
                    <WfoServiceTicketStatusBadge
                        serviceTicketState={serviceTicketDetail.process_state}
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
                    <WfoImpactLevelBadge
                        impactedObjectImpact={cimDefaultSendingLevel}
                        size={'m'}
                    />
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
            <EuiFlexGroup justifyContent={'spaceBetween'} alignItems={'center'}>
                <EuiFlexItem grow={7}>
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
                </EuiFlexItem>
                <EuiFlexItem grow={1}>
                    <EuiButton
                        onClick={handleAcceptTicket}
                        fill
                        iconType={'check'}
                        isDisabled={
                            !acceptImpactEnabledValues.includes(
                                serviceTicketDetail.process_state,
                            )
                        }
                    >
                        {t('acceptImpact')}
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size={'m'} />
            <WfoImpactTable serviceTicketDetail={serviceTicketDetail} />
        </>
    );
};
