import React from 'react';

import { useTranslations } from 'next-intl';

import { SubscriptionKeyValueBlock } from '@/components';
import { SubscriptionDetail } from '@/types';

interface WfoSubscriptionFixedInputSectionProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WfoSubscriptionFixedInputSection = ({
    subscriptionDetail,
}: WfoSubscriptionFixedInputSectionProps) => {
    const t = useTranslations('subscriptions.detail');

    const fixedInputBlockData = subscriptionDetail.fixedInputs.map(
        (fixedInput) => ({
            key: fixedInput.field,
            value: fixedInput.value,
        }),
    );

    return (
        <SubscriptionKeyValueBlock
            title={t('blockTitleFixedInputs')}
            keyValues={fixedInputBlockData}
        />
    );
};
