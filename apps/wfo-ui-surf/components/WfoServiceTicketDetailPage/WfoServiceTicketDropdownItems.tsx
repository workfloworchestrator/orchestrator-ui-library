import React from 'react';

import { EuiButtonEmpty, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { useOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import {
    ServiceTicketProcessState,
    ServiceTicketType,
    ServiceTicketWithDetails,
} from '../../types';

interface ServiceTicketDropdownItemsProps {
    serviceTicket: ServiceTicketWithDetails;
}

export const ServiceTicketDropdownItems = ({
    serviceTicket,
}: ServiceTicketDropdownItemsProps) => {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('cim.serviceTickets.detail');
    const router = useRouter();

    const navigateToNewEmailPage = () => {
        const currentPath = router.asPath;
        router.push(`${currentPath}/new-email`);
    };

    return (
        <EuiFlexGroup
            direction={'column'}
            alignItems={'flexStart'}
            gutterSize={'none'}
            css={{ paddingRight: theme.size.xxxxl }}
        >
            <EuiFlexItem>
                <EuiButtonEmpty
                    color={'text'}
                    isDisabled={
                        !(
                            serviceTicket.process_state ===
                            ServiceTicketProcessState.OPEN_ACCEPTED
                        )
                    }
                    onClick={navigateToNewEmailPage}
                >
                    {t('buttons.sendOpenEmail')}
                </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem>
                <EuiButtonEmpty
                    color={'text'}
                    isDisabled={
                        !(
                            serviceTicket.process_state ===
                                ServiceTicketProcessState.OPEN ||
                            serviceTicket.process_state ===
                                ServiceTicketProcessState.UPDATED
                        )
                    }
                    onClick={navigateToNewEmailPage}
                >
                    {t('buttons.sendUpdateEmail')}
                </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem>
                <EuiButtonEmpty
                    color={'text'}
                    isDisabled={
                        !(
                            serviceTicket.process_state ===
                                ServiceTicketProcessState.OPEN_ACCEPTED &&
                            serviceTicket.type === ServiceTicketType.INCIDENT
                        )
                    }
                    onClick={navigateToNewEmailPage}
                >
                    {t('buttons.sendOpenCloseEmail')}
                </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem>
                <EuiButtonEmpty
                    color={'text'}
                    isDisabled={
                        !(
                            serviceTicket.process_state ===
                                ServiceTicketProcessState.OPEN ||
                            serviceTicket.process_state ===
                                ServiceTicketProcessState.UPDATED
                        )
                    }
                    onClick={navigateToNewEmailPage}
                >
                    {t('buttons.sendCloseEmail')}
                </EuiButtonEmpty>
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
