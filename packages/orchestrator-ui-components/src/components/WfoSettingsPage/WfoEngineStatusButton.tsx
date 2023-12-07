import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton } from '@elastic/eui';

import { EngineStatus } from '@/types';

interface WfoEngineStatusButtonProps {
    engineStatus?: EngineStatus;
    changeEngineStatus: () => void;
}

export const WfoEngineStatusButton: FC<WfoEngineStatusButtonProps> = ({
    engineStatus,
    changeEngineStatus,
}) => {
    const t = useTranslations('settings.page');
    if (!engineStatus) {
        return (
            <EuiButton isLoading fill>
                Loading...
            </EuiButton>
        );
    }
    return engineStatus === 'RUNNING' ? (
        <EuiButton
            onClick={changeEngineStatus}
            color="warning"
            fill
            iconType="pause"
        >
            {t('pauseEngine')}
        </EuiButton>
    ) : (
        <EuiButton
            onClick={changeEngineStatus}
            color="primary"
            fill
            iconType="play"
        >
            {t('startEngine')}
        </EuiButton>
    );
};
