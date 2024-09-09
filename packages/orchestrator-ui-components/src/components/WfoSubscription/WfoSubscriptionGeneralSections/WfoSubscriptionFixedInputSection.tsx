import React from 'react';

import { useTranslations } from 'next-intl';

import { SubscriptionKeyValueBlock } from '@/components';
import { SubscriptionDetail } from '@/types';

interface WfoSubscriptionFixedInputSectionProps {
    fixedInputs: SubscriptionDetail['fixedInputs'];
}

export const WfoSubscriptionFixedInputSection = ({
    fixedInputs,
}: WfoSubscriptionFixedInputSectionProps) => {
    const t = useTranslations('subscriptions.detail');

    const fixedInputBlockData = fixedInputs.map((fixedInput) => ({
        key: fixedInput.field,
        value: fixedInput.value,
    }));

    return (
        <SubscriptionKeyValueBlock
            title={t('blockTitleFixedInputs')}
            keyValues={fixedInputBlockData}
        />
    );
};
