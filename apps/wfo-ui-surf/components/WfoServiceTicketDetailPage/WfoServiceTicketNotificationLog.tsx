import React from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiHorizontalRule,
    EuiPanel,
    EuiSpacer,
    EuiText,
    EuiTimeline,
    EuiTitle,
} from '@elastic/eui';
import {
    WfoBell,
    formatDateCetWithUtc,
} from '@orchestrator-ui/orchestrator-ui-components';

import { WfoAvatar } from '@/components/WfoAvatar/WfoAvatar';
import { ServiceTicketLogType, ServiceTicketWithDetails } from '@/types';

interface WfoSubscriptionGeneralProps {
    serviceTicketDetail: ServiceTicketWithDetails;
}

export const WfoServiceTicketNotificationLog = ({
    serviceTicketDetail,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.notificationLog',
    );
    const items = serviceTicketDetail.logs.map((log, index) => {
        return {
            icon: <WfoAvatar stepStatus={log.log_type} icon={<WfoBell />} />,
            iconAriaLabel: log.log_type,
            children: (
                <>
                    <EuiPanel color={'subdued'} hasShadow={false}>
                        {log.log_type === ServiceTicketLogType.UPDATE ? (
                            <EuiTitle size="s">
                                <h4>
                                    {log.log_type.toUpperCase()} #{index}
                                </h4>
                            </EuiTitle>
                        ) : (
                            <EuiTitle size="s">
                                <h4>{log.log_type.toUpperCase()}</h4>
                            </EuiTitle>
                        )}
                        <EuiText color="subdued">
                            {formatDateCetWithUtc(log.entry_time)}
                        </EuiText>
                        <EuiSpacer size={'m'}></EuiSpacer>
                        <EuiText>
                            <b>{t('nl')}:</b> {serviceTicketDetail.title_nl}
                        </EuiText>
                        <EuiHorizontalRule margin={'xs'} />
                        <EuiText>
                            <b>{t('en')}:</b> {serviceTicketDetail.title_en}
                        </EuiText>
                    </EuiPanel>
                </>
            ),
        };
    });

    return (
        <>
            <EuiSpacer />
            <EuiTimeline items={items} aria-label={'notification log'} />
            {items.length === 0 && (
                <EuiText color="subdued">
                    {t('noLogsAvailableForThisServiceTicket')}
                </EuiText>
            )}
        </>
    );
};
