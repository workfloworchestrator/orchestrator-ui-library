import {
    useOrchestratorTheme,
    WfoBadge,
    WfoBasicTable,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { ReactNode, useState } from 'react';
import {
    EuiButtonIcon,
    EuiScreenReaderOnly,
    EuiText,
    EuiDescriptionList,
} from '@elastic/eui';
import { ServiceTicketImpactedObject } from '../../types';
import { useTranslations } from 'next-intl';
import { useQueryClient } from 'react-query';
import Link from 'next/link';

const SUBSCRIPTION_IMPACT_FIELD_ID: keyof ServiceTicketImpactedObject =
    'subscription_id';
const SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS: keyof ServiceTicketImpactedObject =
    'subscription_description';
const SUBSCRIPTION_IMPACT_FIELD_AFFECTED_CUSTOMERS: keyof ServiceTicketImpactedObject =
    'related_customers';
const SUBSCRIPTION_IMPACT_FIELD_INFORM_CUSTOMERS: keyof ServiceTicketImpactedObject =
    'related_customers';
const SUBSCRIPTION_IMPACT_FIELD_IMS_CALCULATED_IMPACT: keyof ServiceTicketImpactedObject =
    'ims_circuits';
const SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE: keyof ServiceTicketImpactedObject =
    'impact_override';

export const WfoSubscriptionImpactTable = () => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactTable',
    );
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData([
        'serviceTickets',
        'ca5eab65-761a-4235-aac8-048ff1aa0171',
    ]);
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<
        Record<string, ReactNode>
    >({});

    const calculateAffectedCustomers = (
        object: ServiceTicketImpactedObject,
    ) => {
        return object.related_customers.length + 1;
    };

    const renderImsCircuitsImpact = (object: ServiceTicketImpactedObject) => {
        const ims_circuits = object.ims_circuits;
        return ims_circuits
            ? ims_circuits[ims_circuits.length - 1].impact
            : 'null';
    };

    const toggleDetails = (object: ServiceTicketImpactedObject) => {
        const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
        const id = object.subscription_id ? object.subscription_id : '0';
        console.log(itemIdToExpandedRowMapValues, 'toggleDetails');
        console.log(object, 'object');

        if (itemIdToExpandedRowMapValues[id]) {
            delete itemIdToExpandedRowMapValues[id];
        } else {
            const { subscription_description } = object;

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
                <EuiDescriptionList listItems={listItems} />
            );
        }
        setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
    };

    const impactTableColumns = {
        expander: {
            field: SUBSCRIPTION_IMPACT_FIELD_ID,
            width: '20',
            isExpander: true,
            name: (
                <EuiScreenReaderOnly>
                    <span>Expand rows</span>
                </EuiScreenReaderOnly>
            ),
            render: (
                value: keyof ServiceTicketImpactedObject,
                object: ServiceTicketImpactedObject,
            ) => {
                const itemIdToExpandedRowMapValues = {
                    ...itemIdToExpandedRowMap,
                };
                console.log('OBJECT', object);
                console.log(
                    itemIdToExpandedRowMapValues,
                    'itemIdToExpandedRowMapValues',
                );
                return object ? (
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
                    <EuiText>null</EuiText>
                );
            },
        },
        subscription_description: {
            field: SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS,
            name: t('subscriptionTitle'),
            width: '200',
            render: (
                value: keyof ServiceTicketImpactedObject,
                object: ServiceTicketImpactedObject,
            ) => (
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
            render: (
                _: keyof ServiceTicketImpactedObject,
                object: ServiceTicketImpactedObject,
            ) => (
                <WfoBadge
                    textColor={theme.colors.text}
                    color={theme.colors.lightShade}
                >
                    {calculateAffectedCustomers(object)}
                </WfoBadge>
            ),
            sortable: true,
        },
        informCustomers: {
            field: SUBSCRIPTION_IMPACT_FIELD_INFORM_CUSTOMERS,
            name: t('informCustomers'),
            width: '50',
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
            width: '100',
            render: (
                _: keyof ServiceTicketImpactedObject,
                object: ServiceTicketImpactedObject,
            ) => (
                <WfoBadge
                    textColor={theme.colors.successText}
                    color={toSecondaryColor(theme.colors.success)}
                >
                    {renderImsCircuitsImpact(object)}
                </WfoBadge>
            ),
            sortable: true,
        },
        nocManualImpactOverride: {
            field: SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE,
            name: t('nocManualOverride'),
            width: '100',
            render: (
                _: keyof ServiceTicketImpactedObject,
                object: ServiceTicketImpactedObject,
            ) => {
                return object.impact_override ? (
                    <WfoBadge
                        textColor={theme.colors.successText}
                        color={toSecondaryColor(theme.colors.success)}
                    >
                        {object.impact_override}
                    </WfoBadge>
                ) : (
                    <EuiText>-</EuiText>
                );
            },
            sortable: true,
        },
    };

    return (
        <WfoBasicTable
            // @ts-expect-error - data is not null
            data={data ? data.impacted_objects : []}
            // @ts-expect-error - type is still not specified
            columns={impactTableColumns}
            isExpandable={true}
            tableLayout="auto"
            itemIdToExpandedRowMap={itemIdToExpandedRowMap}
            itemId="subscription_id"
        />
    );
};
