import React, { FC, useState } from 'react';
import { EuiButton, EuiPopover, EuiSelectable } from '@elastic/eui';

export type ComboBoxOption = {
    itemID: string;
    label: string;
};

export type WFOButtonComboBoxProps = {
    buttonText: string;
    options: ComboBoxOption[];
    onOptionChange: (selectedOption: ComboBoxOption) => void;
};

export const WFOButtonComboBox: FC<WFOButtonComboBoxProps> = ({
    buttonText,
    options,
    onOptionChange,
}) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);

    const Button = (
        <EuiButton
            onClick={() => setPopoverOpen(!isPopoverOpen)}
            iconType="plus"
            fullWidth
        >
            {buttonText}
        </EuiButton>
    );

    // Todo: initialFocus does not work with multiple searchFields
    return (
        <EuiPopover
            css={{
                inlineSize: '100%',
                div: { inlineSize: '100%' },
            }}
            initialFocus={'.euiFieldSearch'}
            button={Button}
            isOpen={isPopoverOpen}
            closePopover={() => setPopoverOpen(false)}
        >
            <EuiSelectable
                css={{ width: '300px' }}
                searchable
                options={options}
                onChange={(_, __, changedOption) =>
                    onOptionChange(changedOption)
                }
            >
                {(list, search) => (
                    <>
                        {search}
                        {list}
                    </>
                )}
            </EuiSelectable>
        </EuiPopover>
    );
};
