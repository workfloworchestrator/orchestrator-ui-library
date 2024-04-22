import React, { useState } from 'react';

import { EuiButton, EuiPopover, EuiSelectable, EuiSpacer } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoPlusCircleFill } from '@/icons';
import { ColorModes, StartComboBoxOption } from '@/types';

import { getStyles } from './styles';

export type WfoStartButtonComboBoxProps = {
    buttonText: string;
    options: StartComboBoxOption[];
    onOptionChange: (selectedOption: StartComboBoxOption) => void;
    isProcess: boolean;
};

export const WfoStartButtonComboBox = ({
    buttonText,
    options,
    onOptionChange,
    isProcess,
}: WfoStartButtonComboBoxProps) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const { selectableStyle } = getStyles();
    const { theme, colorMode } = useOrchestratorTheme();

    const isDarkThemeActive = colorMode === ColorModes.DARK;
    const iconColor = isDarkThemeActive
        ? theme.colors.title
        : theme.colors.emptyShade;

    const Button = (
        <EuiButton
            onClick={() => setPopoverOpen(!isPopoverOpen)}
            iconType={
                isProcess
                    ? 'plus'
                    : () => <WfoPlusCircleFill color={iconColor} />
            }
            fullWidth={isProcess}
            fill={!isProcess || isDarkThemeActive}
        >
            {buttonText}
        </EuiButton>
    );

    return (
        <EuiPopover
            initialFocus={`.euiSelectable .euiFieldSearch`}
            button={Button}
            isOpen={isPopoverOpen}
            closePopover={() => setPopoverOpen(false)}
        >
            <EuiSelectable<StartComboBoxOption>
                css={selectableStyle}
                searchable
                options={options}
                onChange={(_, __, changedOption) =>
                    onOptionChange(changedOption)
                }
            >
                {(list, search) => (
                    <>
                        {search}
                        <EuiSpacer size="s" />
                        {list}
                    </>
                )}
            </EuiSelectable>
        </EuiPopover>
    );
};
