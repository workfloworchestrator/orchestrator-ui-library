import React, { useContext, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiButtonEmpty,
    EuiButtonIcon,
    EuiCopy,
    EuiDescriptionList,
    EuiDescriptionListDescription,
    EuiDescriptionListTitle,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiLink,
    EuiSpacer,
    EuiText,
    EuiTitle,
} from '@elastic/eui';
import {
    WfoBadge,
    WfoCheckmarkCircleFill,
    WfoDropdownTable,
    WfoInformationModal,
    WfoTableColumns,
    WfoViewList,
    WfoXCircleFill,
    useFilterQueryWithRest,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { MINL_BY_SUBSCRIPTION_ENDPOINT } from '../../constants-surf';
import { SurfConfigContext } from '../../contexts/surfConfigContext';
import {
    CustomerWithContacts,
    ImpactedCustomerContact,
    ImpactedCustomersTableColumns,
    ImpactedObject,
    ServiceTicketDefinition,
} from '../../types';
import { WfoImpactLevelBadge } from '../WfoBadges/WfoImpactLevelBadge';
import { WfoCustomersContactsModal } from './WfoCustomersContactsModal';
import { mapImpactedObjectToImpactedCustomersColumns } from './utils';

interface WfoImpactedCustomersTableProps {
    impactedObject: ImpactedObject;
}

// const defaultTableStyle = css({
//     '.euiTableCellContent__text': {
//         display: 'flex',
//     },
// });

//TODO: Try max width for the customers table
//ADD empty column that pushes everything to the left
//add width to every column except the last one
export const WfoImpactedCustomersTable = ({
    impactedObject,
}: WfoImpactedCustomersTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactCustomerTable',
    );
    const { cimDefaultSendingLevel } = useContext(SurfConfigContext);
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    const [contactsModal, setContactsModal] = useState<CustomerWithContacts>();
    const [imsModal, setImsModal] = useState();

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

    const ShowImsInformationButton = () => (
        <EuiButtonEmpty size="s" onClick={() => setImsModal(true)}>
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
            >
                <EuiFlexItem>
                    <WfoDropdownTable
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
                <WfoInformationModal
                    title={t('imsInformationModalTitle')}
                    onClose={handleCloseImsModal}
                >
                    <EuiText>IMS Details here</EuiText>
                </WfoInformationModal>
            )}
        </>
    );
};
