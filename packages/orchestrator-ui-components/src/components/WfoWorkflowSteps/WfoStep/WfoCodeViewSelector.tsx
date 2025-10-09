import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonGroup } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

export enum CodeView {
    JSON = 'json',
    TABLE = 'table',
    RAW = 'raw',
}

interface WfoCodeViewSelectorProps {
    codeView: CodeView;
    setCodeView;
}

export const WfoCodeViewSelector = ({
    codeView,
    setCodeView,
}: WfoCodeViewSelectorProps) => {
    const t = useTranslations('processes.steps');
    const { theme } = useOrchestratorTheme();

    const codeViewOptions = [
        {
            id: CodeView.JSON,
            label: t('codeView.json'),
            iconType: 'logoElastic',
            'data-test-subj': 'jsonCodeViewButton',
        },
        {
            id: CodeView.TABLE,
            label: t('codeView.table'),
            iconType: 'tableDensityNormal',
            'data-test-subj': 'tableCodeViewButton',
        },
        {
            id: CodeView.RAW,
            label: t('codeView.raw'),
            iconType: 'document',
            'data-test-subj': 'rawCodeViewButton',
        },
    ];

    return (
        <EuiButtonGroup
            legend="Default single select button group"
            options={codeViewOptions}
            idSelected={codeView}
            onChange={(id) => setCodeView(id)}
        />
    );
};
