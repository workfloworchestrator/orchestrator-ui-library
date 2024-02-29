import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexItem, EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';

import { WfoEngineStatusButton } from './WfoEngineStatusButton';
import { WfoResetTextSearchIndexButton } from './WfoResetTextSearchIndexButton';

export const WfoModifySettings = () => {
    const t = useTranslations('settings.page');
    return (
        <EuiFlexItem>
            <EuiPanel
                hasShadow={false}
                color="subdued"
                paddingSize="l"
                css={{ width: '50%' }}
            >
                <EuiText size="s">
                    <h4>{t('resetTextSearchIndex')}</h4>
                </EuiText>
                <EuiSpacer size="m"></EuiSpacer>
                <WfoResetTextSearchIndexButton />
            </EuiPanel>
            <EuiSpacer />
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
                <WfoEngineStatusButton />
            </EuiPanel>
        </EuiFlexItem>
    );
};
