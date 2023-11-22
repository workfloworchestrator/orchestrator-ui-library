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
    ServiceTicketImpactedObject,
    ServiceTicketImpactedObjectColumns,
    ServiceTicketWithDetails,
} from '../../types';
import { WfoSubscriptionImpactCustomerTable } from './WfoSubscriptionImpactCustomerTable';

const SUBSCRIPTION_IMPACT_FIELD_ID: keyof ServiceTicketImpactedObjectColumns =
    'subscription_id';
const SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS: keyof ServiceTicketImpactedObjectColumns =
    'subscription_description';
const SUBSCRIPTION_IMPACT_FIELD_AFFECTED_CUSTOMERS: keyof ServiceTicketImpactedObjectColumns =
    'affectedCustomers';
const SUBSCRIPTION_IMPACT_FIELD_INFORM_CUSTOMERS: keyof ServiceTicketImpactedObjectColumns =
    'informCustomers';
const SUBSCRIPTION_IMPACT_FIELD_IMS_CALCULATED_IMPACT: keyof ServiceTicketImpactedObjectColumns =
    'imsCalculatedImpact';
const SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE: keyof ServiceTicketImpactedObjectColumns =
    'impact_override';

interface WfoSubscriptionImpactTableProps {
    serviceTicketDetail: ServiceTicketWithDetails;
}

export const WfoSubscriptionImpactTable = ({
    serviceTicketDetail,
}: WfoSubscriptionImpactTableProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactTable',
    );
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<
        Record<string, ReactNode>
    >({});

    const toggleDetails = (id: string) => {
        const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
        // const id = object.subscription_id ? object.subscription_id : '0';
        const impactedObject: ServiceTicketImpactedObject =
            serviceTicketDetail.impacted_objects.find(
                (o) => o.subscription_id === id,
            );

        if (itemIdToExpandedRowMapValues[id]) {
            delete itemIdToExpandedRowMapValues[id];
        } else {
            const { subscription_description } = impactedObject;

            const color = subscription_description ? 'success' : 'danger';
            const label = subscription_description ? 'Online' : 'Offline';
            const listItems = [
                {
                    title: 'Location',
                    description: subscription_description,
                },
                {
                    title: 'Online',
                    description: <EuiText color={color}>{label}</EuiText>,
                },
            ];
            itemIdToExpandedRowMapValues[id] = (
                <WfoSubscriptionImpactCustomerTable
                    impactedObject={impactedObject}
                ></WfoSubscriptionImpactCustomerTable>
            );
        }
        setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
    };

    const impactTableColumns: WfoTableColumns<ServiceTicketImpactedObjectColumns> =
        {
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
                render: () => (
                    <WfoBadge
                        textColor={theme.colors.text}
                        color={theme.colors.lightShade}
                    >
                        4
                    </WfoBadge>
                ),
                sortable: true,
            },
            imsCalculatedImpact: {
                field: SUBSCRIPTION_IMPACT_FIELD_IMS_CALCULATED_IMPACT,
                name: t('imsCalculatedImpact'),
                width: '75',
                render: (value) => (
                    <WfoBadge
                        textColor={theme.colors.successText}
                        color={toSecondaryColor(theme.colors.success)}
                    >
                        {value}
                    </WfoBadge>
                ),
                sortable: true,
            },
            impact_override: {
                field: SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE,
                name: t('nocManualOverride'),
                width: '75',
                render: (value) => {
                    return value ? (
                        <WfoBadge
                            textColor={theme.colors.successText}
                            color={toSecondaryColor(theme.colors.success)}
                        >
                            {value}
                        </WfoBadge>
                    ) : (
                        <EuiText>-</EuiText>
                    );
                },
                sortable: true,
            },
        };

    const mapDataToTable = (
        input: ServiceTicketImpactedObject[],
    ): ServiceTicketImpactedObjectColumns[] => {
        return input.map((object) => ({
            subscription_id: object.subscription_id,
            subscription_description: object.subscription_description,
            affectedCustomers: object.related_customers.length + 1,
            informCustomers: 4,
            imsCalculatedImpact:
                object.ims_circuits[object.ims_circuits.length - 1].impact ??
                '',
            impact_override: object.impact_override,
        }));
    };

    return (
        <WfoBasicTable
            data={
                serviceTicketDetail
                    ? mapDataToTable(serviceTicketDetail.impacted_objects)
                    : []
            }
            columns={impactTableColumns}
            isExpandable={true}
            itemIdToExpandedRowMap={itemIdToExpandedRowMap}
            itemId="subscription_id"
        />
    );
};
