import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';

import { EngineStatus } from '@/types';

import { WfoEngineStatusButton } from './WfoEngineStatusButton';

export type WfoModifySettingsProps = {
    engineStatus?: EngineStatus;
    changeEngineStatus: () => void;
};

export const WfoModifySettings: FC<WfoModifySettingsProps> = ({
    engineStatus,
    changeEngineStatus,
}) => {
    const t = useTranslations('settings.page');
    return (
        <EuiPanel
            hasShadow={false}
            color="subdued"
            paddingSize="l"
            css={{ width: '50%' }}
        >
            <EuiText size="s">
                <h4>{t('modifyEngine')}</h4>
            </EuiText>
            <EuiSpacer size="m"></EuiSpacer>
            <WfoEngineStatusButton
                engineStatus={engineStatus}
                changeEngineStatus={changeEngineStatus}
            />
        </EuiPanel>
    );
};
