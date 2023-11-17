import {
    parseDateToLocaleDateTimeString,
    WfoBasicTable,
} from '@orchestrator-ui/orchestrator-ui-components';
import Link from 'next/link';
import { WfoServiceTicketStatusBadge } from '../WfoBadges/WfoServiceTicketStatusBadge';
import React from 'react';
import { EuiText } from '@elastic/eui';
import { ServiceTicketDefinition } from '../../types';
import { useTranslations } from 'next-intl';

const SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS: keyof ServiceTicketDefinition =
    'jira_ticket_id';
const SUBSCRIPTION_IMPACT_FIELD_AFFECTED_CUSTOMERS: keyof ServiceTicketDefinition =
    'title_nl';
const SUBSCRIPTION_IMPACT_FIELD_INFORM_CUSTOMERS: keyof ServiceTicketDefinition =
    'process_state';
const SUBSCRIPTION_IMPACT_FIELD_IMS_CALCULATED_IMPACT: keyof ServiceTicketDefinition =
    'opened_by';
const SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE: keyof ServiceTicketDefinition =
    'start_date';

export const WfoSubscriptionImpactTable = () => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactTable',
    );

    const data: any = [{ example: 'test' }, { example: 'test2' }];

    const impactTableColumns = {
        subscriptions: {
            field: SUBSCRIPTION_IMPACT_FIELD_SUBSCRIPTIONS,
            name: t('subscriptionTitle'),
            width: '150',
            render: () => <EuiText>Hello</EuiText>,
            sortable: true,
        },
        affectedCustomers: {
            field: SUBSCRIPTION_IMPACT_FIELD_AFFECTED_CUSTOMERS,
            name: t('affectedCustomers'),
            width: '100',
            render: () => <EuiText>Hello</EuiText>,
            sortable: true,
        },
        informCustomers: {
            field: SUBSCRIPTION_IMPACT_FIELD_INFORM_CUSTOMERS,
            name: t('informCustomers'),
            width: '100',
            render: () => <EuiText>Hello</EuiText>,
            sortable: true,
        },
        imsCalculatedImpact: {
            field: SUBSCRIPTION_IMPACT_FIELD_IMS_CALCULATED_IMPACT,
            name: t('imsCalculatedImpact'),
            width: '100',
            render: () => <EuiText>Hello</EuiText>,
            sortable: true,
        },
        nocManualImpactOverride: {
            field: SUBSCRIPTION_IMPACT_FIELD_NOC_MANUAL_OVERRIDE,
            name: t('nocManualOverride'),
            width: '100',
            render: () => <EuiText>Hello</EuiText>,
            sortable: true,
        },
    };

    return <WfoBasicTable data={data} columns={impactTableColumns} />;
};
