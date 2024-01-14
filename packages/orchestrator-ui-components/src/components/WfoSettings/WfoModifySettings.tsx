import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';

import { WfoEngineStatusButton } from './WfoEngineStatusButton';

export const WfoModifySettings = () => {
    const t = useTranslations('settings.page');
    return (
        <EuiPanel
            hasShadow={false}
            color="subdued"
            paddingSize="l"
            css={{ width: '50%' }}
        >
            <EuiText size={'s'}>
                <h4>{t('modifyEngine')}</h4>
            </EuiText>
            <EuiSpacer size="m"></EuiSpacer>
            <WfoEngineStatusButton />
        </EuiPanel>
    );
};
