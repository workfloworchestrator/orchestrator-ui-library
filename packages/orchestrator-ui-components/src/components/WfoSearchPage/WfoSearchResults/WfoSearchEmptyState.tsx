import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

export const WfoSearchEmptyState: FC = () => {
    const t = useTranslations('search.page');
    const { theme } = useOrchestratorTheme();

    return (
        <EuiPanel paddingSize="l" color="transparent" hasShadow={false}>
            <EuiFlexGroup justifyContent="center" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiText size="m" color={theme.colors.textSubdued}>
                        {t('noResultsFound')}
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
