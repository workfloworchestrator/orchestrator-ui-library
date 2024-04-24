import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiFlexGroup,
    EuiForm,
    EuiFormRow,
    EuiPopover,
    EuiSwitch,
    EuiText,
} from '@elastic/eui';

import { WfoTextAnchor } from '@/components/WfoTextAnchor/WfoTextAnchor';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoCode, WfoEyeFill } from '@/icons';

import { getStyles } from '../styles';

export type WfoStepListHeaderProps = {
    showHiddenKeys: boolean;
    showRaw: boolean;
    showDelta: boolean;
    showTraceback: boolean;
    showTracebackButton: boolean;
    allDetailToggleText: string;
    onChangeShowRaw: (showRaw: boolean) => void;
    onChangeShowDelta: (showRaw: boolean) => void;
    onChangeShowHiddenKeys: (showHiddenKeys: boolean) => void;
    onShowTraceback: (showTraceback: boolean) => void;
    onToggleAllDetailsIsOpen: () => void;
    isTask: boolean;
};

export const WfoStepListHeader: FC<WfoStepListHeaderProps> = ({
    showHiddenKeys,
    showRaw,
    showDelta,
    showTraceback,
    showTracebackButton,
    onChangeShowHiddenKeys,
    onChangeShowRaw,
    onChangeShowDelta,
    allDetailToggleText,
    onToggleAllDetailsIsOpen,
    onShowTraceback,
    isTask,
}) => {
    const t = useTranslations('processes.steps');
    const { theme } = useOrchestratorTheme();
    const {
        stepListHeaderStyle,
        stepListContentStyle,
        stepListContentBoldTextStyle,
        stepListOptionsContainerStyle,
    } = useWithOrchestratorTheme(getStyles);

    const [isViewOptionOpen, setIsViewOptionOpen] = useState(false);

    const onViewOptionClick = () =>
        setIsViewOptionOpen((isViewOptionOpen) => !isViewOptionOpen);
    const closeViewOption = () => setIsViewOptionOpen(false);

    const viewOptionButton = (
        <EuiButton
            onClick={onViewOptionClick}
            iconType={() => <WfoEyeFill color={theme.colors.link} />}
            iconSide="right"
            size="s"
        >
            {t('viewOptions')}
        </EuiButton>
    );

    return (
        <EuiFlexGroup css={stepListHeaderStyle}>
            {/* Left side: header and expand/collapse button */}
            <EuiFlexGroup css={stepListContentStyle}>
                <EuiText css={stepListContentBoldTextStyle}>
                    {t(isTask ? 'taskSteps' : 'workflowSteps')}
                </EuiText>
                {!showRaw && (
                    <WfoTextAnchor
                        text={allDetailToggleText}
                        onClick={onToggleAllDetailsIsOpen}
                    />
                )}
            </EuiFlexGroup>

            {/* Right side: view options */}
            <EuiFlexGroup
                justifyContent="flexEnd"
                direction="row"
                css={stepListOptionsContainerStyle}
                gutterSize="s"
            >
                {showTracebackButton && (
                    <EuiButton
                        onClick={() => onShowTraceback(!showTraceback)}
                        size="s"
                    >
                        {showTraceback
                            ? t('hideTraceback')
                            : t('showTraceback')}
                    </EuiButton>
                )}
                <EuiButton
                    onClick={() => onChangeShowDelta(!showDelta)}
                    iconSide="right"
                    size="s"
                    iconType={() => <WfoCode color={theme.colors.link} />}
                >
                    {showDelta ? t('hideDelta') : t('showDelta')}
                </EuiButton>
                <EuiPopover
                    button={viewOptionButton}
                    isOpen={isViewOptionOpen}
                    closePopover={closeViewOption}
                    display="block"
                >
                    <div>
                        <EuiForm component="form">
                            <EuiFormRow>
                                <EuiSwitch
                                    label="Hidden keys"
                                    checked={showHiddenKeys}
                                    onChange={(e) => {
                                        onChangeShowHiddenKeys(
                                            e.target.checked,
                                        );
                                        closeViewOption();
                                    }}
                                />
                            </EuiFormRow>
                            <EuiFormRow>
                                <EuiSwitch
                                    label="Raw JSON data"
                                    checked={showRaw}
                                    onChange={(e) => {
                                        onChangeShowRaw(e.target.checked);
                                        closeViewOption();
                                    }}
                                />
                            </EuiFormRow>
                        </EuiForm>
                    </div>
                </EuiPopover>
            </EuiFlexGroup>
        </EuiFlexGroup>
    );
};
