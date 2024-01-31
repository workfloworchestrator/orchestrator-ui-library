import React, { ReactNode, useContext, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiButtonIcon, EuiText } from '@elastic/eui';
import {
    WfoBadge,
    WfoBasicTable,
    WfoTableColumns,
    getWfoBasicTableStyles,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { SurfConfigContext } from '@/contexts/SurfConfigContext';
import {
    ImpactTableColumns,
    ImpactedObject,
    ServiceTicketProcessState,
    ServiceTicketWithDetails,
} from '@/types';

import { WfoImpactLevelBadge } from '../WfoBadges/WfoImpactLevelBadge';
import { WfoImpactOverrideModal } from './WfoImpactOverrideModal';
import { WfoImpactedCustomersTable } from './WfoImpactedCustomersTable';
import { getImpactedCustomersTableData, getImsCalculatedImpact } from './utils';

const SUBSCRIPTION_IMPACT_FIELD_ID: keyof ImpactTableColumns = 'subscriptionId';
const SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS: keyof ImpactTableColumns =
    'subscriptionDescription';
const SUBSCRIPTION_IMPACT_FIELD_AFFECTED_CUSTOMERS: keyof ImpactTableColumns =
    'affectedCustomers';
const SUBSCRIPTION_IMPACT_FIELD_INFORM_CUSTOMERS: keyof ImpactTableColumns =
    'informCustomers';
const SUBSCRIPTION_IMPACT_FIELD_IMS_CALCULATED_IMPACT: keyof ImpactTableColumns =
    'imsCalculatedImpact';
const SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE: keyof ImpactTableColumns =
    'impactOverride';
const SUBSCRIPTION_IMPACT_FIELD_SET_IMPACT_OVERRIDE: keyof ImpactTableColumns =
    'showImpactOverride';

interface WfoImpactTableProps {
    serviceTicketDetail: ServiceTicketWithDetails;
}

export const WfoImpactTable = ({
    serviceTicketDetail,
}: WfoImpactTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactTable',
    );
    const { cimDefaultSendingLevel } = useContext(SurfConfigContext);
    const { theme } = useOrchestratorTheme();
    const { expandableTableStyle } = getWfoBasicTableStyles(theme);

    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<
        Record<string, ReactNode>
    >({});
    const [currentModalItemIndex, setCurrentModalItemIndex] = useState(-1);
    const showImpactOverride =
        serviceTicketDetail.process_state ===
            ServiceTicketProcessState.OPEN_ACCEPTED ||
        serviceTicketDetail.process_state ===
            ServiceTicketProcessState.OPEN_RELATED;

    const toggleDetails = (impactTableColumns: ImpactTableColumns) => {
        const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
        const subscriptionId = impactTableColumns.subscriptionId!;
        const tableData = impactTableColumns.impactedCustomersTableData;

        if (itemIdToExpandedRowMapValues[subscriptionId]) {
            delete itemIdToExpandedRowMapValues[subscriptionId];
        } else if (tableData) {
            itemIdToExpandedRowMapValues[subscriptionId] = (
                <WfoImpactedCustomersTable
                    impactCustomerTableData={tableData}
                />
            );
        }
        setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
    };

    const impactTableColumns: WfoTableColumns<ImpactTableColumns> = {
        subscriptionId: {
            field: SUBSCRIPTION_IMPACT_FIELD_ID,
            width: '20',
            name: '',
            render: (value, object) => {
                const itemIdToExpandedRowMapValues = {
                    ...itemIdToExpandedRowMap,
                };
                return value ? (
                    <EuiButtonIcon
                        onClick={() => toggleDetails(object)}
                        aria-label={
                            itemIdToExpandedRowMapValues[value]
                                ? 'Collapse'
                                : 'Expand'
                        }
                        iconType={
                            itemIdToExpandedRowMapValues[value]
                                ? 'arrowDown'
                                : 'arrowRight'
                        }
                    />
                ) : (
                    <EuiButtonIcon disabled iconType="arrowRight" />
                );
            },
        },
        subscriptionDescription: {
            field: SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS,
            name: t('subscriptionTitle'),
            width: '200',
            render: (value, object) => (
                <Link href={`/subscriptions/${object.subscriptionId}`}>
                    {value}
                </Link>
            ),
            sortable: true,
        },
        affectedCustomers: {
            field: SUBSCRIPTION_IMPACT_FIELD_AFFECTED_CUSTOMERS,
            name: t('affectedCustomers'),
            width: '75',
            render: (value) => (
                <WfoBadge
                    textColor={theme.colors.text}
                    color={theme.colors.lightShade}
                >
                    {value}
                </WfoBadge>
            ),
            sortable: true,
        },
        informCustomers: {
            field: SUBSCRIPTION_IMPACT_FIELD_INFORM_CUSTOMERS,
            name: t('informCustomers'),
            width: '75',
            render: (value) => (
                <WfoBadge
                    textColor={theme.colors.text}
                    color={theme.colors.lightShade}
                >
                    {value}
                </WfoBadge>
            ),
            sortable: true,
        },
        imsCalculatedImpact: {
            field: SUBSCRIPTION_IMPACT_FIELD_IMS_CALCULATED_IMPACT,
            name: t('imsCalculatedImpact'),
            width: '75',
            render: (value) => (
                <WfoImpactLevelBadge impactedObjectImpact={value} />
            ),
            sortable: true,
        },
        impactOverride: {
            field: SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE,
            name: t('nocManualOverride'),
            width: '75',
            render: (value) => {
                return value ? (
                    <WfoImpactLevelBadge impactedObjectImpact={value} />
                ) : (
                    <EuiText color={theme.colors.darkShade}>-</EuiText>
                );
            },
            sortable: true,
        },
        showImpactOverride: {
            field: SUBSCRIPTION_IMPACT_FIELD_SET_IMPACT_OVERRIDE,
            name: '',
            width: '15',
            render: (value, object) => {
                const index = serviceTicketDetail.impacted_objects.findIndex(
                    (o) => o.subscription_id === object.subscriptionId,
                );
                return (
                    value && (
                        <EuiButtonIcon
                            onClick={() => {
                                setCurrentModalItemIndex(index);
                            }}
                            display="base"
                            iconType="pencil"
                        />
                    )
                );
            },
        },
    };

    const mapImpactedObjectsToImpactTableColumns = (
        input: ImpactedObject[],
    ): ImpactTableColumns[] => {
        return input
            .filter((object) => object.subscription_id !== null)
            .map((object) => {
                const impactedCustomersTableData =
                    getImpactedCustomersTableData(
                        object,
                        cimDefaultSendingLevel,
                    );
                return {
                    subscriptionId: object.subscription_id,
                    subscriptionDescription: object.subscription_description,
                    affectedCustomers: object.related_customers.length + 1,
                    informCustomers: impactedCustomersTableData.informCustomers,
                    imsCalculatedImpact: getImsCalculatedImpact(object),
                    impactOverride: object.impact_override,
                    showImpactOverride: showImpactOverride,
                    impactedCustomersTableData: impactedCustomersTableData,
                };
            });
    };

    const handleModalAction = () => {
        setCurrentModalItemIndex(-1);
    };

    return (
        <>
            <WfoBasicTable
                data={
                    serviceTicketDetail
                        ? mapImpactedObjectsToImpactTableColumns(
                              serviceTicketDetail.impacted_objects,
                          )
                        : []
                }
                columns={impactTableColumns}
                isExpandable={true}
                itemIdToExpandedRowMap={itemIdToExpandedRowMap}
                itemId="subscriptionId"
                customTableStyle={expandableTableStyle}
            />
            {currentModalItemIndex >= 0 && (
                <WfoImpactOverrideModal
                    serviceTicketDetail={serviceTicketDetail}
                    index={currentModalItemIndex}
                    closeAction={handleModalAction}
                />
            )}
        </>
    );
};
