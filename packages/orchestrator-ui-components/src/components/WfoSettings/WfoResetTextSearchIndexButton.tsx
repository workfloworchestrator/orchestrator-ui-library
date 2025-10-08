import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton } from '@elastic/eui';

import { useResetTextSearchIndexMutation } from '@/rtk';

export const WfoResetTextSearchIndexButton = () => {
    const [resetTextSearchIndex] = useResetTextSearchIndexMutation();

    const t = useTranslations('settings.page');

    return (
        <EuiButton
            onClick={() => resetTextSearchIndex(null)}
            iconType="refresh"
        >
            {t('resetTextSearchIndexButton')}
        </EuiButton>
    );
};
