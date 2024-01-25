import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiSuperSelect,
    EuiText,
} from '@elastic/eui';
import { useOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

import { getStyles } from '@/components/WfoEmailList/styles';
import { WfoCustomersContactsModal } from '@/components/WfoServiceTicketDetailPage/WfoCustomersContactsModal';
import { CustomerWithContacts, Email } from '@/types';

interface WfoEmailStepContentProps {
    emails: Email[];
}

export const WfoEmailStepContent = ({ emails }: WfoEmailStepContentProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.sentEmails',
    );
    const { theme } = useOrchestratorTheme();
    const { recipientButtonStyle } = getStyles(theme);

    const [selectedEmail, setSelectedEmail] = useState<Email>(emails[0]);
    const [isContactsModalOpen, setIsContactsModalOpen] =
        useState<CustomerWithContacts>();

    const onChange = (selectedOption: Email) => {
        setSelectedEmail(selectedOption);
    };

    const handleCloseContactsModal = () => {
        setIsContactsModalOpen(undefined);
    };

    const mapEmailToOption = (email: Email) => ({
        value: email,
        inputDisplay: (
            <EuiText css={{ overflowX: 'hidden' }}>
                {email?.customer.customer_name ?? ''}
            </EuiText>
        ),
    });

    const RecipientsButton = () => {
        const recipentsLength = selectedEmail?.to.length ?? 0;
        const recipientsButtonText =
            recipentsLength > 1
                ? `${t('showAll')} ${recipentsLength} ${t('recipients')}`
                : `${t('show')} ${recipentsLength} ${t('recipient')}`;

        return (
            <EuiText
                onClick={() =>
                    setIsContactsModalOpen({
                        name: selectedEmail.customer.customer_name ?? '',
                        contacts: selectedEmail.to ?? [],
                    })
                }
                color={theme.colors.primaryText}
                css={recipientButtonStyle}
            >
                {recipientsButtonText}
            </EuiText>
        );
    };

    return (
        <EuiPanel
            color="subdued"
            paddingSize="xl"
            css={{ marginTop: theme.size.m }}
        >
            <EuiFlexGroup wrap={true}>
                <EuiFlexItem
                    grow={1}
                    css={{ minWidth: theme.breakpoint.s / 2 }}
                >
                    <EuiText>
                        <b>{t('customer')}</b>
                    </EuiText>
                    <EuiSpacer size="s" />
                    <EuiSuperSelect
                        fullWidth
                        options={emails.map(mapEmailToOption)}
                        valueOfSelected={selectedEmail}
                        onChange={onChange}
                    />
                    <EuiSpacer />
                    <EuiText>
                        <b>{t('recipientsLabel')}</b>
                    </EuiText>
                    <EuiSpacer size="xs" />
                    <RecipientsButton />
                </EuiFlexItem>
                <EuiPanel
                    paddingSize={'none'}
                    css={{
                        height: theme.breakpoint.m,
                        overflow: 'auto',
                        maxWidth: theme.breakpoint.m,
                    }}
                    className="eui-scrollBar"
                    dangerouslySetInnerHTML={{
                        __html: selectedEmail?.message ?? '',
                    }}
                />
            </EuiFlexGroup>
            {isContactsModalOpen && (
                <WfoCustomersContactsModal
                    customerWithContacts={isContactsModalOpen}
                    handleClose={handleCloseContactsModal}
                />
            )}
        </EuiPanel>
    );
};
