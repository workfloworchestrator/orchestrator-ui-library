import React from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButtonIcon,
    EuiCopy,
    EuiDescriptionListDescription,
    EuiDescriptionListTitle,
    EuiFlexGroup,
    EuiFlexItem,
    EuiHorizontalRule,
    EuiLink,
    EuiModal,
    EuiPanel,
    EuiSpacer,
} from '@elastic/eui';
import { WfoInformationModal } from '@orchestrator-ui/orchestrator-ui-components';

import { CustomerWithContacts, ImpactedCustomerContact } from '../../types';

interface WfoCustomersContactsModalProps {
    customerWithContacts: CustomerWithContacts;
    handleClose: () => void;
}

export const WfoCustomersContactsModal = ({
    customerWithContacts,
    handleClose,
}: WfoCustomersContactsModalProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactCustomerTable',
    );

    return (
        <WfoInformationModal title={'Customer contacts'} onClose={handleClose}>
            {/*<EuiPanel color={"subdued"} borderRadius={"none"} paddingSize={"none"} >*/}
            <EuiDescriptionListTitle>{t('customer')}</EuiDescriptionListTitle>
            <EuiDescriptionListDescription>
                {customerWithContacts.name}
            </EuiDescriptionListDescription>
            <EuiSpacer size={'m'} />
            {customerWithContacts.contacts.map(
                (contact: ImpactedCustomerContact, index: number) => (
                    <>
                        <EuiDescriptionListTitle>
                            {t('contact') + ' '}
                            {customerWithContacts.contacts.length > 1
                                ? index + 1
                                : ''}
                        </EuiDescriptionListTitle>
                        <EuiDescriptionListDescription>
                            {contact.name}
                        </EuiDescriptionListDescription>
                        <EuiFlexGroup gutterSize={'xs'} alignItems={'center'}>
                            <EuiFlexItem grow={false}>
                                <EuiLink>{contact.email}</EuiLink>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiCopy textToCopy={contact.email}>
                                    {(copy) => (
                                        <EuiButtonIcon
                                            onClick={copy}
                                            iconType="copy"
                                            aria-label="Copy"
                                        />
                                    )}
                                </EuiCopy>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                        <EuiSpacer size={'m'} />
                        <EuiHorizontalRule margin={'none'} />
                    </>
                ),
            )}
            {/*</EuiPanel>*/}
        </WfoInformationModal>
    );
};
