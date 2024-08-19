import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoXCircleFill } from '@/icons';
import { WfoGraphqlErrorResponse } from '@/rtk';

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

export const WfoErrorWithMessage = ({ error }: WfoGraphqlErrorResponse) => {
    const t = useTranslations('common');
    const { theme } = useOrchestratorTheme();
    const message =
        error.length > 0
            ? error.map((err) => err.message).join(', ')
            : t('unknownError');
    return (
        <>
            <EuiFlexGroup direction="row" alignItems="center" gutterSize="s">
                <WfoXCircleFill color={theme.colors.danger} />
                {/*<EuiText>{t('errorMessage')}:</EuiText>*/}
                <EuiText color={theme.colors.dangerText}>
                    {t('errorMessage')} ({message})
                </EuiText>
            </EuiFlexGroup>
        </>
    );
};
