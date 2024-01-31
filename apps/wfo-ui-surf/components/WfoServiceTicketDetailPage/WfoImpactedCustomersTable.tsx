import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiModal,
    EuiModalHeader,
    EuiText,
} from '@elastic/eui';
import {
    WfoBadge,
    WfoBasicTable,
    WfoCheckmarkCircleFill,
    WfoTableColumns,
    WfoViewList,
    WfoXCircleFill,
    getWfoBasicTableStyles,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import {
    CustomerWithContacts,
    ImpactedCustomersTableColumns,
    ImpactedCustomersTableData,
} from '@/types';

import { WfoImpactLevelBadge } from '../WfoBadges/WfoImpactLevelBadge';
import { WfoCustomersContactsModal } from './WfoCustomersContactsModal';
import { WfoImsCircuitsTable } from './WfoImsCircuitsTable';

interface WfoImpactedCustomersTableProps {
    impactCustomerTableData: ImpactedCustomersTableData;
}

export const WfoImpactedCustomersTable = ({
    impactCustomerTableData,
}: WfoImpactedCustomersTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactCustomerTable',
    );
    const { theme } = useOrchestratorTheme();
    const [isContactsModalOpen, setIsContactsModalOpen] =
        useState<CustomerWithContacts>();
    const [isImsModalOpen, setIsImsModalOpen] = useState<boolean | undefined>();
    const { dropDownTableStyle } = getWfoBasicTableStyles(theme);

    const impactedCustomersTableColumns: WfoTableColumns<ImpactedCustomersTableColumns> =
        {
            customer: {
                name: t('customers'),
                field: 'customer',
                render: (customer) => (
                    <EuiText size="s">
                        <b>{customer.customer_abbrev}</b>
                    </EuiText>
                ),
            },
            relation: {
                field: 'relation',
                name: t('relation'),
                render: (value) => (
                    <WfoBadge textColor={theme.colors.darkestShade}>
                        {value}
                    </WfoBadge>
                ),
            },
            contacts: {
                field: 'contacts',
                name: t('contacts'),
                render: (value, object) => (
                    <EuiButtonEmpty
                        size={'xs'}
                        onClick={() =>
                            setIsContactsModalOpen({
                                name: object.customer.customer_name,
                                contacts: value,
                            })
                        }
                    >
                        <EuiText>
                            <u>{value.length}</u>
                        </EuiText>
                    </EuiButtonEmpty>
                ),
            },
            acceptedImpact: {
                field: 'acceptedImpact',
                name: t('acceptedImpact'),
                render: (value) => (
                    <WfoImpactLevelBadge impactedObjectImpact={value} />
                ),
            },
            minl: {
                field: 'minl',
                name: t('minl'),
                render: (value) =>
                    value && (
                        <WfoImpactLevelBadge impactedObjectImpact={value} />
                    ),
            },
            sendingLevel: {
                field: 'sendingLevel',
                name: t('sendingLevel'),
                render: (value) => (
                    <WfoImpactLevelBadge impactedObjectImpact={value} />
                ),
            },
            informCustomer: {
                field: 'informCustomer',
                name: t('informCustomer'),
                render: (value) =>
                    value ? (
                        <WfoCheckmarkCircleFill
                            width={24}
                            height={24}
                            color={theme.colors.success}
                        />
                    ) : (
                        <WfoXCircleFill
                            width={24}
                            height={24}
                            color={theme.colors.danger}
                        />
                    ),
            },
        };

    const handleCloseContactsModal = () => {
        setIsContactsModalOpen(undefined);
    };

    const handleCloseImsModal = () => {
        setIsImsModalOpen(undefined);
    };

    const handleOpenImsModal = () => {
        setIsImsModalOpen(true);
    };

    const ShowImsInformationButton = () => (
        <EuiButtonEmpty size="s" onClick={handleOpenImsModal}>
            <EuiFlexGroup gutterSize="s" alignItems="center">
                <EuiFlexItem>
                    <WfoViewList color={theme.colors.primary} />
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiText size="s" color={theme.colors.primary}>
                        <b>{t('showImsServiceInformation')}</b>
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiButtonEmpty>
    );

    return (
        <>
            <EuiFlexGroup
                gutterSize={'xs'}
                direction="column"
                alignItems={'flexStart'}
                css={{ backgroundColor: theme.colors.lightestShade }}
            >
                <EuiFlexItem>
                    <WfoBasicTable
                        data={impactCustomerTableData.columns}
                        columns={impactedCustomersTableColumns}
                        customTableStyle={dropDownTableStyle}
                    />
                </EuiFlexItem>
                <EuiFlexItem>
                    <ShowImsInformationButton />
                </EuiFlexItem>
            </EuiFlexGroup>
            {isContactsModalOpen && (
                <WfoCustomersContactsModal
                    customerWithContacts={isContactsModalOpen}
                    handleClose={handleCloseContactsModal}
                />
            )}
            {isImsModalOpen && (
                <EuiModal
                    onClose={handleCloseImsModal}
                    style={{
                        width: '1500px',
                        maxWidth: '1500px',
                        padding: theme.size.m,
                    }}
                    title={t('imsInformationModalTitle')}
                >
                    <EuiModalHeader>
                        <EuiText size="s">
                            <b>{t('imsInformationModalTitle')}</b>
                        </EuiText>
                    </EuiModalHeader>
                    <WfoImsCircuitsTable
                        imsCircuits={impactCustomerTableData.imsCircuits}
                    />
                </EuiModal>
            )}
        </>
    );
};
