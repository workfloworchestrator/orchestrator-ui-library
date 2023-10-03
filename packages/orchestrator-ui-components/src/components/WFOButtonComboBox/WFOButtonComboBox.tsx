import React, { FC, useState } from 'react';
import { EuiButton, EuiPopover, EuiSelectable, EuiSpacer } from '@elastic/eui';
import { getStyles } from './styles';

export type WorkflowComboBoxOption = {
    data: {
        workflowName: string;
        productId: string;
    };
    label: string;
};

export type WFOButtonComboBoxProps = {
    buttonText: string;
    options: WorkflowComboBoxOption[];
    onOptionChange: (selectedOption: WorkflowComboBoxOption) => void;
};

export const WFOButtonComboBox: FC<WFOButtonComboBoxProps> = ({
    buttonText,
    options,
    onOptionChange,
}) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const { popoverStyle, selectableStyle } = getStyles();

    const Button = (
        <EuiButton
            onClick={() => setPopoverOpen(!isPopoverOpen)}
            iconType="plus"
            fullWidth
        >
            {buttonText}
        </EuiButton>
    );

    return (
        <EuiPopover
            css={popoverStyle}
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
