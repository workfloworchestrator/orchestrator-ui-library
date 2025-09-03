import React, { useEffect } from 'react';
import ReactSelect, { components } from 'react-select';
import type { GroupBase, InputProps } from 'react-select';

import { EuiButtonIcon } from '@elastic/eui';

import { WfoError } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import type { Option } from '@/types';

import { getWfoReactSelectStyles } from './styles';

interface WfoReactSelectProps<ValueType> {
    options: Option<ValueType>[];
    id: string;
    onChange: (value: ValueType | undefined) => void;
    value: ValueType;
    disabled?: boolean;
    isLoading?: boolean;
    placeholder?: string;
    hasError?: boolean;
    refetch?: () => void;
}

export const WfoReactSelect = <ValueType,>({
    options,
    id,
    onChange,
    value,
    disabled = false,
    isLoading = false,
    placeholder = 'Select an option',
    hasError = false,
    refetch,
}: WfoReactSelectProps<ValueType>) => {
    useEffect(() => {
        const selectedValue = options.find(
            (option: Option<ValueType>) => option.value === value,
        );
        setSelectedValue(selectedValue || null);
    }, [value]);

    const initialValue = options.find(
        (option: Option<ValueType>) => option.value === value,
    );

    const [selectedValue, setSelectedValue] =
        React.useState<Option<ValueType> | null>(initialValue || null);

    // React select allows callbacks to supply style for innercomponents: https://react-select.com/styles#inner-components
    const {
        reactSelectInnerComponentStyles,
        containerStyle,
        refreshButtonStyle,
        reactSelectStyle,
    } = useWithOrchestratorTheme(getWfoReactSelectStyles);

    if (hasError) {
        return <WfoError />;
    }

    // Way to add data-testid based on https://react-select.com/components
    const Input = ({
        ...props
    }: InputProps<Option<ValueType>, false, GroupBase<Option<ValueType>>>) => {
        return (
            <components.Input {...props} data-testid={`${id}.search-input`} />
        );
    };

    return (
        <div css={containerStyle}>
            {refetch && (
                <EuiButtonIcon
                    className="reload-subscriptions-icon-button"
                    css={refreshButtonStyle}
                    aria-label={`refetch-${id}`}
                    id={`refresh-icon-${id}`}
                    iconType="refresh"
                    iconSize="l"
                    disabled={disabled}
                    onClick={() => {
                        refetch();
                    }}
                    data-testid={`${id}-refresh-button`}
                />
            )}
            <ReactSelect<Option<ValueType>, false>
                id={id}
                inputId={`${id}.search`}
                onChange={(option) => {
                    if (option === null) {
                        // By default reactSelect reverts to the initial option when cleared
                        // this is to make sure we can also deselect the value after it is
                        // initialized from error state for example.
                        setSelectedValue(null);
                        onChange(undefined);
                    } else {
                        const selectedValue = option?.value;
                        setSelectedValue(option);
                        onChange(selectedValue);
                    }
                }}
                css={reactSelectStyle}
                isLoading={isLoading}
                styles={reactSelectInnerComponentStyles}
                options={options}
                value={selectedValue || null}
                isSearchable={true}
                isClearable={true}
                placeholder={placeholder}
                isDisabled={disabled}
                components={{
                    Input,
                }}
            />
        </div>
    );
};
