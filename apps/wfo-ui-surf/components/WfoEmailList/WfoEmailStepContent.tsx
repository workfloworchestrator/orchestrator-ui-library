import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { EuiComboBoxOptionOption } from '@elastic/eui/src/components/combo_box/types';
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

    const onChange = (selectedOptions: EuiComboBoxOptionOption[]) => {
        const match =
            emails.find(
                (email: Email) => email._id === selectedOptions[0]?.value,
            ) ?? emails[0];
        setSelectedEmail(match);
    };

    const handleCloseContactsModal = () => {
        setIsContactsModalOpen(undefined);
    };

    const mapEmailToOption = (email: Email): EuiComboBoxOptionOption => ({
        label: email?.customer.customer_name ?? '',
        value: email?._id ?? '',
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
                    grow={2}
                    css={{ minWidth: theme.breakpoint.s / 2 }}
                >
                    <EuiText>
                        <b>{t('customer')}</b>
                    </EuiText>
                    <EuiSpacer size="s" />
                    <EuiComboBox
                        options={emails.map(mapEmailToOption)}
                        selectedOptions={[mapEmailToOption(selectedEmail)]}
                        onChange={onChange}
                        singleSelection={{ asPlainText: true }}
                    />
                    <EuiSpacer />
                    <EuiText>
                        <b>{t('recipientsLabel')}</b>
                    </EuiText>
                    <EuiSpacer size="xs" />
                    <RecipientsButton />
                </EuiFlexItem>
                <EuiFlexItem
                    grow={5}
                    css={{ overflowY: 'scroll', maxHeight: theme.breakpoint.m }}
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
