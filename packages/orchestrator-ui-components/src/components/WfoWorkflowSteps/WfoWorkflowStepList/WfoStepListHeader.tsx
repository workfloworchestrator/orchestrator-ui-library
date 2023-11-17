import React, { FC, useState } from 'react';

import {
    EuiButton,
    EuiFlexGroup,
    EuiForm,
    EuiFormRow,
    EuiPopover,
    EuiSwitch,
    EuiText,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { useOrchestratorTheme } from '../../../hooks';
import { WfoCode, WfoEyeFill } from '../../../icons';
import { getStyles } from '../styles';

export type WfoStepListHeaderProps = {
    showHiddenKeys: boolean;
    showRaw: boolean;
    allDetailToggleText: string;
    onChangeShowRaw: (showRaw: boolean) => void;
    onChangeShowHiddenKeys: (showHiddenKeys: boolean) => void;
    onToggleAllDetailsIsOpen: () => void;
};

export const WfoStepListHeader: FC<WfoStepListHeaderProps> = ({
    showHiddenKeys,
    showRaw,
    onChangeShowHiddenKeys,
    onChangeShowRaw,
    allDetailToggleText,
    onToggleAllDetailsIsOpen,
}) => {
    const t = useTranslations('processes.steps');
    const { theme } = useOrchestratorTheme();
    const {
        stepListHeaderStyle,
        stepListContentStyle,
        stepListContentBoldTextStyle,
        stepListContentAnchorStyle,
        stepListOptionsContainerStyle,
    } = getStyles(theme);

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
                    {t('steps')}
                </EuiText>
                {!showRaw && (
                    <EuiText
                        css={stepListContentAnchorStyle}
                        onClick={onToggleAllDetailsIsOpen}
                    >
                        {allDetailToggleText}
                    </EuiText>
                )}
            </EuiFlexGroup>

            {/* Right side: view options */}
            <EuiFlexGroup
                justifyContent="flexEnd"
                direction="row"
                css={stepListOptionsContainerStyle}
                gutterSize="s"
            >
                <EuiButton
                    onClick={(
                        e: React.MouseEvent<
                            HTMLButtonElement | HTMLElement,
                            MouseEvent
                        >,
                    ) => {
                        e.preventDefault();
                        alert('TODO: Implement Show delta');
                    }}
                    iconSide="right"
                    size="s"
                    iconType={() => <WfoCode color={theme.colors.link} />}
                >
                    {t('showDelta')}
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
