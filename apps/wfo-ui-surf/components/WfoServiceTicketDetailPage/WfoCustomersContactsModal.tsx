import React from 'react';

import {
    EuiFlexItem,
    EuiHorizontalRule,
    EuiModal,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { useOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

import { CustomerWithContacts, ImpactedCustomerContact } from '../../types';

interface WfoCustomersContactsModalProps {
    customerWithContacts: CustomerWithContacts;
    handleClose: () => void;
}

export const WfoCustomersContactsModal = ({
    customerWithContacts,
    handleClose,
}: WfoCustomersContactsModalProps) => {
    const { theme } = useOrchestratorTheme();

    return (
        <EuiModal onClose={handleClose}>
            <EuiText
                css={{ paddingTop: theme.size.l, paddingLeft: theme.size.l }}
            >
                <b>{customerWithContacts.name}</b>
            </EuiText>
            <EuiSpacer size={'m'} />
            <EuiHorizontalRule margin={'none'} />
            <EuiFlexItem css={{ overflowY: 'scroll' }}>
                {customerWithContacts.contacts.map(
                    (contact: ImpactedCustomerContact) => (
                        <>
                            <EuiFlexItem css={{ paddingLeft: theme.size.l }}>
                                <EuiSpacer size={'m'} />
                                <EuiText>
                                    <b>{contact.name}</b>
                                </EuiText>
                                <EuiText
                                    size={'s'}
                                    color={theme.colors.primaryText}
                                >
                                    {contact.email}
                                </EuiText>
                                <EuiSpacer size={'m'} />
                            </EuiFlexItem>
                            <EuiHorizontalRule margin={'none'} />
                        </>
                    ),
                )}
                <EuiPanel
                    color={'subdued'}
                    css={{ paddingBlock: theme.size.xxxxl }}
                />
            </EuiFlexItem>
        </EuiModal>
    );
};
