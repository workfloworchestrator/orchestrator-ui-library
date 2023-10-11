import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { RelatedSubscription, SubscriptionDetail } from '../../types';
import { WFOTableColumns } from '../WFOTable';
import { WFONoResults } from '../WFONoResults';
import { WFOFirstPartUUID } from '../WFOTable/WFOFirstPartUUID';
import { WFOBasicTable } from '../WFOTable';
import { WFOSearchStrikethrough } from '../../icons';
import { useOrchestratorTheme } from '../../hooks';
import { WFOSubscriptionStatusBadge } from '../WFOBadges';
import { parseDateToLocaleDateString, parseDate } from '../../utils';
import { EuiSpacer } from '@elastic/eui';

interface WFORelatedSubscriptionsProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WFORelatedSubscriptions = ({
    subscriptionDetail,
}: WFORelatedSubscriptionsProps) => {
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();

    const relatedSubscriptions =
        subscriptionDetail &&
        subscriptionDetail.inUseBySubscriptions &&
        subscriptionDetail.inUseBySubscriptions.page;

    const tableColumns: WFOTableColumns<RelatedSubscription> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: t('id'),
            width: '100',
            render: (value) => <WFOFirstPartUUID UUID={value} />,
        },
        description: {
            field: 'description',
            name: t('description'),
            render: (value, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
        },
        status: {
            field: 'status',
            name: t('status'),
            width: '100',
            render: (value) => <WFOSubscriptionStatusBadge status={value} />,
        },
        insync: {
            field: 'insync',
            name: t('insync'),
            width: '60',
            render: () => 'X',
        },
        customer: {
            field: 'customer',
            name: t('customer'),
            render: (customer) => customer.fullname,
        },
        product: {
            field: 'product',
            name: t('tag'),
            width: '150',
            render: (product) => product.tag,
        },
        startDate: {
            field: 'startDate',
            name: t('startDate'),
            width: '100',
            render: (value) => parseDateToLocaleDateString(parseDate(value)),
        },
    };

    return (
        (relatedSubscriptions && relatedSubscriptions.length > 0 && (
            <>
                <EuiSpacer size="l" />
                <WFOBasicTable<RelatedSubscription>
                    data={relatedSubscriptions}
                    columns={tableColumns}
                />
            </>
        )) || (
            <WFONoResults
                text={t('noRelatedSubscriptions')}
                icon={<WFOSearchStrikethrough color={theme.colors.link} />}
            />
        )
    );
};
