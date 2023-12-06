import React from 'react';

import {
    EuiFlexItem,
    EuiHorizontalRule,
    EuiModal,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { css } from '@emotion/react';
import {
    WfoValueCell,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

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

    const valueCellStyle = css({
        fontWeight: theme.font.weight.regular,
        color: theme.colors.primaryText,
    });

    const valueColumnStyle = css({
        paddingTop: theme.size.s,
        display: 'flex',
        '&:hover > div': {
            visibility: 'visible',
        },
    });

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
                                <WfoValueCell
                                    value={contact.email}
                                    textToCopy={contact.email}
                                    rowNumber={1}
                                    enableCopyIcon={true}
                                    valueCellCustomStyle={valueCellStyle}
                                    valueColumnCustomStyle={valueColumnStyle}
                                />
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
