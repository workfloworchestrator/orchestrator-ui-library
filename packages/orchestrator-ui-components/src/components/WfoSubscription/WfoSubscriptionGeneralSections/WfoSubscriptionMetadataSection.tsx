import React from 'react';

import { useTranslations } from 'next-intl';

import { SubscriptionKeyValueBlock, WfoJsonCodeBlock } from '@/components';
import { SubscriptionDetail } from '@/types';
import { camelToHuman } from '@/utils';

interface WfoSubscriptionMetadataSectionProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WfoSubscriptionMetadataSection = ({
    subscriptionDetail,
}: WfoSubscriptionMetadataSectionProps) => {
    const t = useTranslations('subscriptions.detail');

    const metadataBlockData = Object.entries(subscriptionDetail.metadata).map(
        ([key, value]) => ({
            key: camelToHuman(key),
            value: <WfoJsonCodeBlock data={value} isBasicStyle />,
        }),
    );

    return (
        <SubscriptionKeyValueBlock
            title={t('metadata')}
            keyValues={metadataBlockData}
        />
    );
};
