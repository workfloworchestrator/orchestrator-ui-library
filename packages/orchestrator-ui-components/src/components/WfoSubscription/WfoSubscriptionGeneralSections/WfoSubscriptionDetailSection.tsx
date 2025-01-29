import React from 'react';

import { useTranslations } from 'next-intl';

import {
    SubscriptionKeyValueBlock,
    WfoCustomerDescriptionsField,
    WfoInSyncField,
    WfoSubscriptionDetailNoteEdit,
    WfoSubscriptionStatusBadge,
} from '@/components';
import { SubscriptionDetail } from '@/types';
import { formatDate, toOptionalArrayEntry } from '@/utils';

interface WfoSubscriptionDetailSectionProps {
    isFetching: boolean;
    subscriptionDetail: SubscriptionDetail;
}

export const WfoSubscriptionDetailSection = ({
    isFetching,
    subscriptionDetail,
}: WfoSubscriptionDetailSectionProps) => {
    const t = useTranslations('subscriptions.detail');

    const hasCustomerDescriptions =
        subscriptionDetail.customerDescriptions.length > 0;

    const {
        subscriptionId,
        product,
        description,
        startDate,
        endDate,
        status,
        customer,
        customerDescriptions,
    } = subscriptionDetail;

    const subscriptionDetailBlockData = [
        {
            key: t('subscriptionId'),
            value: subscriptionId,
            textToCopy: subscriptionId,
        },
        {
            key: t('productName'),
            value: product.name,
        },
        {
            key: t('description'),
            value: description,
        },
        {
            key: t('startDate'),
            value: formatDate(startDate),
        },
        {
            key: t('endDate'),
            value: formatDate(endDate),
        },
        {
            key: t('status'),
            value: <WfoSubscriptionStatusBadge status={status} />,
        },
        {
            key: t('insync'),
            value: (
                <WfoInSyncField
                    subscriptionDetail={subscriptionDetail}
                    isFetching={isFetching}
                />
            ),
        },
        {
            key: t('customer'),
            value:
                subscriptionDetail && subscriptionDetail.customer
                    ? `${customer?.fullname}`
                    : '-',
        },
        {
            key: t('customerUuid'),
            value:
                subscriptionDetail && customer
                    ? `${customer?.customerId}`
                    : '-',
            textToCopy: customer?.customerId,
        },
        ...toOptionalArrayEntry(
            {
                key: t('customerDescriptions'),
                value: (
                    <WfoCustomerDescriptionsField
                        customerDescriptions={customerDescriptions}
                    />
                ),
            },
            hasCustomerDescriptions,
        ),
        {
            key: t('note'),
            value: (
                <WfoSubscriptionDetailNoteEdit
                    subscriptionId={subscriptionId}
                    onlyShowOnHover={true}
                />
            ),
        },
    ];

    return (
        <SubscriptionKeyValueBlock
            title={t('blockTitleSubscriptionDetails')}
            keyValues={subscriptionDetailBlockData}
        />
    );
};
