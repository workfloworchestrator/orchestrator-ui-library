import React, { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonGroup } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoBracketSquare, WfoCommandLine, WfoTableCells } from '@/icons';

export enum CodeView {
    JSON = 'json',
    TABLE = 'table',
    RAW = 'raw',
}

interface WfoCodeViewSelectorProps {
    codeView: CodeView;
    handleCodeViewChange: (codeView: CodeView) => void;
}

export const WfoCodeViewSelector = ({
    codeView,
    handleCodeViewChange,
}: WfoCodeViewSelectorProps) => {
    const t = useTranslations('processes.steps');
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const isSelected = (buttonView: CodeView): boolean =>
        buttonView === codeView;
    const [showTooltips, setShowTooltips] = useState<boolean>(true);

    const codeViewOptions = [
        {
            id: CodeView.JSON,
            label: t('codeView.json'),
            onMouseLeave: () => setShowTooltips(true),
            iconType: () => (
                <div onClick={() => setShowTooltips(false)}>
                    <WfoBracketSquare
                        color={
                            isSelected(CodeView.JSON)
                                ? theme.colors.textGhost
                                : theme.colors.textPrimary
                        }
                    />
                </div>
            ),
            'data-test-id': 'jsonCodeViewButton',
            toolTipContent: showTooltips ? t('codeView.json') : undefined,
            style: {
                backgroundColor: isSelected(CodeView.JSON)
                    ? theme.colors.textPrimary
                    : toSecondaryColor(theme.colors.primary),
            },
        },
        {
            id: CodeView.TABLE,
            label: t('codeView.table'),
            onMouseLeave: () => setShowTooltips(true),
            iconType: () => (
                <div onClick={() => setShowTooltips(false)}>
                    <WfoTableCells
                        color={
                            isSelected(CodeView.TABLE)
                                ? theme.colors.textGhost
                                : theme.colors.textPrimary
                        }
                    />
                </div>
            ),
            'data-test-id': 'tableCodeViewButton',
            toolTipContent: showTooltips ? t('codeView.table') : undefined,
            style: {
                backgroundColor: isSelected(CodeView.TABLE)
                    ? theme.colors.textPrimary
                    : toSecondaryColor(theme.colors.primary),
            },
        },
        {
            id: CodeView.RAW,
            label: t('codeView.raw'),
            onMouseLeave: () => setShowTooltips(true),
            iconType: () => (
                <div onClick={() => setShowTooltips(false)}>
                    <WfoCommandLine
                        color={
                            isSelected(CodeView.RAW)
                                ? theme.colors.textGhost
                                : theme.colors.textPrimary
                        }
                    />
                </div>
            ),
            'data-test-id': 'rawCodeViewButton',
            toolTipContent: showTooltips ? t('codeView.raw') : undefined,
            style: {
                backgroundColor: isSelected(CodeView.RAW)
                    ? theme.colors.textPrimary
                    : toSecondaryColor(theme.colors.primary),
            },
        },
    ];

    const handle = useCallback(
        (id: string) => handleCodeViewChange(id as CodeView),
        [handleCodeViewChange],
    );

    return (
        <EuiButtonGroup
            style={{
                gap: 0,
                borderRadius: theme.border.radius.medium,
            }}
            legend=""
            options={codeViewOptions}
            idSelected={codeView}
            isIconOnly={true}
            onChange={handle}
            onClick={(e) => {
                e.stopPropagation();
            }}
            type="single"
        />
    );
};
