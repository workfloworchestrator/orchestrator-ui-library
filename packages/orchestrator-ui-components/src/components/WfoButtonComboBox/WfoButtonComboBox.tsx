import React, { FC, useState } from 'react';

import { EuiButton, EuiPopover, EuiSelectable, EuiSpacer } from '@elastic/eui';

import { getStyles } from './styles';
import { useOrchestratorTheme } from '../../hooks';
import { WfoPlusCircleFill } from '../../icons';

export type WorkflowComboBoxOption = {
    data: {
        workflowName: string;
        productId?: string;
    };
    label: string;
};

export type WfoButtonComboBoxProps = {
    buttonText: string;
    options: WorkflowComboBoxOption[];
    onOptionChange: (selectedOption: WorkflowComboBoxOption) => void;
    isProcess: boolean;
};

export const WfoButtonComboBox: FC<WfoButtonComboBoxProps> = ({
    buttonText,
    options,
    onOptionChange,
    isProcess,
}) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const { selectableStyle } = getStyles();
    const { theme } = useOrchestratorTheme();

    const Button = (
        <EuiButton
            onClick={() => setPopoverOpen(!isPopoverOpen)}
            iconType={
                isProcess
                    ? 'plus'
                    : () => (
                          <WfoPlusCircleFill color={theme.colors.emptyShade} />
                      )
            }
            fullWidth={isProcess}
            fill={!isProcess}
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
            <EuiSelectable<WorkflowComboBoxOption>
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
