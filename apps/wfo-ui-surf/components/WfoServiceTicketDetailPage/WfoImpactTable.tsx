import React, { ReactNode, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiButtonIcon, EuiText } from '@elastic/eui';
import {
    WfoBadge,
    WfoBasicTable,
    WfoTableColumns,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import {
    ImpactTableColumns,
    ImpactedObject,
    ServiceTicketProcessState,
    ServiceTicketWithDetails,
} from '../../types';
import { WfoImpactLevelBadge } from '../WfoBadges/WfoImpactLevelBadge';
import { WfoImpactOverrideModal } from './WfoImpactOverrideModal';
import { WfoImpactedCustomersTable } from './WfoImpactedCustomersTable';
import { getImsCalculatedImpact } from './utils';

const SUBSCRIPTION_IMPACT_FIELD_ID: keyof ImpactTableColumns =
    'subscription_id';
const SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS: keyof ImpactTableColumns =
    'subscription_description';
const SUBSCRIPTION_IMPACT_FIELD_AFFECTED_CUSTOMERS: keyof ImpactTableColumns =
    'affectedCustomers';
const SUBSCRIPTION_IMPACT_FIELD_INFORM_CUSTOMERS: keyof ImpactTableColumns =
    'informCustomers';
const SUBSCRIPTION_IMPACT_FIELD_IMS_CALCULATED_IMPACT: keyof ImpactTableColumns =
    'imsCalculatedImpact';
const SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE: keyof ImpactTableColumns =
    'impact_override';
const SUBSCRIPTION_IMPACT_FIELD_SET_IMPACT_OVERRIDE: keyof ImpactTableColumns =
    'setImpactOverride';

interface WfoImpactTableProps {
    serviceTicketDetail: ServiceTicketWithDetails;
}

export const WfoImpactTable = ({
    serviceTicketDetail,
}: WfoImpactTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactTable',
    );
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<
        Record<string, ReactNode>
    >({});
    const [currentModalItemIndex, setCurrentModalItemIndex] = useState(-1);
    const showOverrideImpact =
        serviceTicketDetail.process_state ===
            ServiceTicketProcessState.OPEN_ACCEPTED ||
        serviceTicketDetail.process_state ===
            ServiceTicketProcessState.OPEN_RELATED;

    const toggleDetails = (subscription_id: string) => {
        const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
        const impactedObject = serviceTicketDetail.impacted_objects.find(
            (o) => o.subscription_id === subscription_id,
        );

        if (itemIdToExpandedRowMapValues[subscription_id]) {
            delete itemIdToExpandedRowMapValues[subscription_id];
        } else if (impactedObject) {
            itemIdToExpandedRowMapValues[subscription_id] = (
                <WfoImpactedCustomersTable impactedObject={impactedObject} />
            );
        }
        setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
    };

    const impactTableColumns: WfoTableColumns<ImpactTableColumns> = {
        subscription_id: {
            field: SUBSCRIPTION_IMPACT_FIELD_ID,
            width: '20',
            name: '',
            render: (value, object) => {
                const itemIdToExpandedRowMapValues = {
                    ...itemIdToExpandedRowMap,
                };
                return value ? (
                    <EuiButtonIcon
                        onClick={() => toggleDetails(value)}
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
        subscription_description: {
            field: SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS,
            name: t('subscriptionTitle'),
            width: '200',
            render: (value, object) => (
                <Link href={`/subscriptions/${object.subscription_id}`}>
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
        impact_override: {
            field: SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE,
            name: t('nocManualOverride'),
            width: '75',
            render: (value) => {
                return value ? (
                    <WfoImpactLevelBadge impactedObjectImpact={value} />
                ) : (
                    <EuiText>-</EuiText>
                );
            },
            sortable: true,
        },
        setImpactOverride: {
            field: SUBSCRIPTION_IMPACT_FIELD_SET_IMPACT_OVERRIDE,
            name: '',
            width: '15',
            render: (value, object) => {
                let index = serviceTicketDetail.impacted_objects.findIndex(
                    (o) => o.subscription_id === object.subscription_id,
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
            .map((object) => ({
                subscription_id: object.subscription_id,
                subscription_description: object.subscription_description,
                affectedCustomers: object.related_customers.length + 1,
                informCustomers: '-',
                imsCalculatedImpact: getImsCalculatedImpact(object),
                impact_override: object.impact_override,
                setImpactOverride: showOverrideImpact,
            }));
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
                itemId="subscription_id"
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
