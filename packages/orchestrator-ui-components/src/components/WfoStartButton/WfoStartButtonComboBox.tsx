import React, { useState } from 'react';

import { EuiButton, EuiPopover, EuiSelectable, EuiSpacer } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoPlusCircleFill } from '@/icons';
import { StartComboBoxOption } from '@/types';

import { getStyles } from './styles';

export type WfoStartButtonComboBoxProps = {
    buttonText: string;
    options: StartComboBoxOption[];
    onOptionChange: (selectedOption: StartComboBoxOption) => void;
    isProcess: boolean;
    className?: string;
};

export const WfoStartButtonComboBox = ({
    buttonText,
    options,
    onOptionChange,
    isProcess,
    className,
}: WfoStartButtonComboBoxProps) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const { theme, isDarkThemeActive } = useOrchestratorTheme();
    const { selectableStyle } = useWithOrchestratorTheme(getStyles);

    const Button = (
        <EuiButton
            onClick={() => setPopoverOpen(!isPopoverOpen)}
            iconType={
                isProcess
                    ? 'plus'
                    : () => <WfoPlusCircleFill color={theme.colors.ghost} />
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
                className={className}
                css={selectableStyle}
                searchable
                options={options}
                onChange={(_, __, changedOption) =>
                    onOptionChange(changedOption)
                }
                height={200}
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
