import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoXCircleFill } from '@/icons';

export const WfoError = () => {
    const t = useTranslations('common');
    const { theme } = useOrchestratorTheme();
    return (
        <EuiFlexGroup direction="row" alignItems="center" gutterSize="s">
            <WfoXCircleFill color={theme.colors.danger} />
            <h1>{t('errorMessage')}</h1>
        </EuiFlexGroup>
    );
};
