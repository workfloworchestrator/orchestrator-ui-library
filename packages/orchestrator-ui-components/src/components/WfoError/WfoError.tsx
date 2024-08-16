import React from 'react';

import { useTranslations } from 'next-intl';
import { SerializableError } from 'next/dist/lib/is-serializable-props';

import { EuiFlexGroup } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoXCircleFill } from '@/icons';
import { RTKQueryError } from '@/rtk';

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

export const WfoErrorWithMessage = ({ error }: { error: RTKQueryError }) => {
    const t = useTranslations('common');
    const { theme } = useOrchestratorTheme();
    const errorData = error as SerializableError;
    const message = errorData?.hasOwnProperty('message')
        ? errorData.message
        : '';

    return (
        <>
            <EuiFlexGroup direction="row" alignItems="center" gutterSize="s">
                <WfoXCircleFill color={theme.colors.danger} />
                <h1>{t('errorMessage')}</h1>
            </EuiFlexGroup>
            <p>{message}</p>
        </>
    );
};
