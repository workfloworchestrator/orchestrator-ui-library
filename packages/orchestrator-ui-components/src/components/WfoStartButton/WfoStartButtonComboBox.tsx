import React, { useState } from 'react';

import { capitalize } from 'lodash';

import {
    EuiButton,
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiPopover,
    EuiSelectable,
    EuiSpacer,
} from '@elastic/eui';

import {
    useGetOrchestratorConfig,
    useOrchestratorTheme,
    useWithOrchestratorTheme,
} from '@/hooks';
import { WfoChevronDown, WfoPlusCircleFill } from '@/icons';
import { ProductLifecycleStatus, StartComboBoxOption } from '@/types';

import { getStyles } from './styles';

export type WfoStartButtonComboBoxProps = {
    buttonText: string;
    options: StartComboBoxOption[];
    onOptionChange: (selectedOption: StartComboBoxOption) => void;
    isProcess: boolean;
    className?: string;
    selectedProductStatus?: ProductLifecycleStatus | string;
    setSelectedProductStatus?: (
        status: ProductLifecycleStatus | string,
    ) => void;
};

export const WfoStartButtonComboBox = ({
    buttonText,
    options,
    onOptionChange,
    isProcess,
    className,
    selectedProductStatus,
    setSelectedProductStatus,
}: WfoStartButtonComboBoxProps) => {
    const { startWorkflowFilters } = useGetOrchestratorConfig();
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const { theme } = useOrchestratorTheme();
    const { selectableStyle } = useWithOrchestratorTheme(getStyles);

    const Button = (
        <EuiButton
            onClick={() => setPopoverOpen(!isPopoverOpen)}
            iconType={() => (
                <WfoPlusCircleFill color={theme.colors.textGhost} />
            )}
            fullWidth={isProcess}
            fill
        >
            {buttonText}
        </EuiButton>
    );

    const [isFilterPopoverOpen, setFilterPopoverOpen] = React.useState(false);

    const ProductStatePicker = () => {
        return setSelectedProductStatus ? (
            <EuiFlexGroup justifyContent="flexEnd" gutterSize="none">
                <EuiPopover
                    button={
                        <EuiButtonEmpty
                            css={{
                                '.euiButtonEmpty__content': {
                                    gap: theme.size.xxs,
                                },
                            }}
                            size="xs"
                            iconSide="right"
                            iconType={() => (
                                <WfoChevronDown
                                    height={18}
                                    width={18}
                                    color="currentColor"
                                />
                            )}
                            onClick={() => setFilterPopoverOpen((v) => !v)}
                        >
                            <b>{capitalize(selectedProductStatus)}</b>
                        </EuiButtonEmpty>
                    }
                    isOpen={isFilterPopoverOpen}
                    closePopover={() => setFilterPopoverOpen(false)}
                    anchorPosition="downRight"
                >
                    {startWorkflowFilters?.map((productStatus) => (
                        <div key={productStatus}>
                            <EuiButtonEmpty
                                key={productStatus}
                                size="xs"
                                onClick={() => {
                                    setSelectedProductStatus(productStatus);
                                    setFilterPopoverOpen(false);
                                }}
                            >
                                {capitalize(productStatus)}
                            </EuiButtonEmpty>
                        </div>
                    ))}
                </EuiPopover>
            </EuiFlexGroup>
        ) : (
            <></>
        );
    };

    return (
        <EuiPopover
            css={{ display: 'flex' }}
            initialFocus={`.euiSelectable .euiFieldSearch`}
            button={Button}
            isOpen={isPopoverOpen}
            closePopover={() => setPopoverOpen(false)}
        >
            {startWorkflowFilters && <ProductStatePicker />}
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
