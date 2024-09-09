import React from 'react';

import { useTranslations } from 'next-intl';

import { SubscriptionKeyValueBlock, WfoProductStatusBadge } from '@/components';
import { SubscriptionDetail } from '@/types';
import { formatDate } from '@/utils';

interface WfoSubscriptionProductInfoSectionProps {
    product: SubscriptionDetail['product'];
}

export const WfoSubscriptionProductInfoSection = ({
    product,
}: WfoSubscriptionProductInfoSectionProps) => {
    const t = useTranslations('subscriptions.detail');

    const productInfoBlockData = [
        {
            key: t('name'),
            value: product.name,
        },
        {
            key: t('description'),
            value: product.description,
        },
        {
            key: t('productType'),
            value: product.productType,
        },
        {
            key: t('tag'),
            value: product.tag,
        },
        {
            key: t('status'),
            value: <WfoProductStatusBadge status={product.status} />,
        },
        {
            key: t('created'),
            value: formatDate(product.createdAt),
        },
        {
            key: t('endDate'),
            value: formatDate(product.endDate),
        },
    ];

    return (
        <SubscriptionKeyValueBlock
            title={t('blockTitleProductInfo')}
            keyValues={productInfoBlockData}
        />
    );
};
