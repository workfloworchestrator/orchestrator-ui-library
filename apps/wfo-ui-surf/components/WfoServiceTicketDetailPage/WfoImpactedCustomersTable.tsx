import React, { useContext, useState } from 'react';

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
    getStyles,
    useFilterQueryWithRest,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { MINL_BY_SUBSCRIPTION_ENDPOINT } from '../../constants-surf';
import { SurfConfigContext } from '../../contexts/surfConfigContext';
import {
    CustomerWithContacts,
    ImpactedCustomersTableColumns,
    ImpactedObject,
    ServiceTicketDefinition,
} from '../../types';
import { WfoImpactLevelBadge } from '../WfoBadges/WfoImpactLevelBadge';
import { WfoCustomersContactsModal } from './WfoCustomersContactsModal';
import { WfoImsCircuitsTable } from './WfoImsCircuitsTable';
import { mapImpactedObjectToImpactedCustomersColumns } from './utils';

interface WfoImpactedCustomersTableProps {
    impactedObject: ImpactedObject;
}

export const WfoImpactedCustomersTable = ({
    impactedObject,
}: WfoImpactedCustomersTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactCustomerTable',
    );
    const { cimDefaultSendingLevel } = useContext(SurfConfigContext);
    const { theme } = useOrchestratorTheme();
    const [contactsModal, setContactsModal] = useState<CustomerWithContacts>();
    const [imsModal, setImsModal] = useState<boolean | undefined>();
    const { dropDownTableStyle } = getStyles(theme);

    const { data: minlObjectFromApi, isFetching } =
        useFilterQueryWithRest<ServiceTicketDefinition>(
            MINL_BY_SUBSCRIPTION_ENDPOINT + impactedObject.subscription_id,
            ['minl', impactedObject.subscription_id ?? ''],
        );

    const impactedCustomersTableColumns: WfoTableColumns<ImpactedCustomersTableColumns> =
        {
            customer: {
                name: t('customers'),
                field: 'customer',
                render: (customer) => (
                    <EuiText size={'s'}>
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
                            setContactsModal({
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
        setContactsModal(undefined);
    };

    const handleCloseImsModal = () => {
        setImsModal(undefined);
    };

    const handleOpenImsModal = () => {
        setImsModal(true);
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
                        data={
                            impactedObject && minlObjectFromApi
                                ? mapImpactedObjectToImpactedCustomersColumns(
                                      impactedObject,
                                      minlObjectFromApi,
                                      cimDefaultSendingLevel,
                                  )
                                : []
                        }
                        isLoading={isFetching}
                        columns={impactedCustomersTableColumns}
                        customTableStyle={dropDownTableStyle}
                    />
                </EuiFlexItem>
                <EuiFlexItem>
                    <ShowImsInformationButton />
                </EuiFlexItem>
            </EuiFlexGroup>
            {contactsModal && (
                <WfoCustomersContactsModal
                    customerWithContacts={contactsModal}
                    handleClose={handleCloseContactsModal}
                />
            )}
            {imsModal && (
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
                        imsCircuits={impactedObject.ims_circuits}
                    />
                </EuiModal>
            )}
        </>
    );
};
