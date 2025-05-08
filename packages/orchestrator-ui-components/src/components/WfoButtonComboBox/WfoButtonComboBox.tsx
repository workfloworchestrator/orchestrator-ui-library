import React, { FC, useState } from 'react';

import {
    EuiPopover,
    EuiSelectable,
    EuiSelectableOption,
    EuiSpacer,
} from '@elastic/eui';

import { getStyles } from '@/components/WfoStartButton/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export type WfoStartButtonComboBoxProps = {
    options: EuiSelectableOption[];
    onOptionChange: (selectedOption: EuiSelectableOption[]) => void;
    children: (togglePopover: () => void) => React.ReactElement;
    className?: string;
};

export const WfoButtonComboBox: FC<WfoStartButtonComboBoxProps> = ({
    options,
    onOptionChange,
    children,
    className,
}) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [optionsState, setOptionsState] =
        useState<EuiSelectableOption[]>(options);

    // Todo move styles to current folder
    const { selectableStyle } = useWithOrchestratorTheme(getStyles);

    return (
        <EuiPopover
            initialFocus={`.euiSelectable .euiFieldSearch`}
            button={children(() => setPopoverOpen(!isPopoverOpen))}
            isOpen={isPopoverOpen}
            closePopover={() => setPopoverOpen(false)}
        >
            <EuiSelectable
                className={className}
                css={selectableStyle}
                options={optionsState}
                searchable
                onChange={(options) => {
                    onOptionChange(options);
                    setOptionsState(options);
                }}
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
