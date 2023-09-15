import {
    EuiButton,
    EuiPopover,
    EuiSelectable,
    useGeneratedHtmlId,
} from '@elastic/eui';
import React, { useState } from 'react';
import { EuiSelectableOption } from '@elastic/eui';
import { useRouter } from 'next/router';

export type ComboBoxOption = {
    itemId: string;
    label: string;
};

export type WFOButtonComboBoxProps = {
    options: ComboBoxOption[];
};

export const WFOButtonComboBox = () => {
    const router = useRouter();

    const [isPopoverOpen, setPopover] = useState(false);
    const containerPopoverId = useGeneratedHtmlId({
        prefix: 'containerPopover',
    });

    const button = (
        <EuiButton
            onClick={() => setPopover(!isPopoverOpen)}
            iconType="plus"
            fullWidth
        >
            New Process
        </EuiButton>
    );

    type TestTest = {
        itemId: string;
    };

    const options: Array<EuiSelectableOption<TestTest>> = [
        {
            itemId: '111-111',
            label: 'Option 1',
        },
        {
            itemId: '222-222',
            label: 'Option 2',
        },
    ];

    return (
        <EuiPopover
            css={{
                inlineSize: '100%',
                div: { inlineSize: '100%' },
            }}
            id={containerPopoverId}
            button={button}
            isOpen={isPopoverOpen}
            closePopover={() => setPopover(false)}
        >
            <EuiSelectable
                css={{ width: '300px' }}
                searchable
                options={options}
                onChange={(options, event, changedOption) => {
                    console.log(options, event, changedOption);
                }}
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
