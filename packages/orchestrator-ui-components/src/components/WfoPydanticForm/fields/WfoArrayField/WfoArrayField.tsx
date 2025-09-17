import React, { use } from 'react';
import { useFieldArray } from 'react-hook-form';

import {
    PydanticFormElementProps,
    RenderFields,
    disableField,
    fieldToComponentMatcher,
    itemizeArrayItem,
    useGetConfig,
    useGetForm,
} from 'pydantic-forms';

import { EuiIcon } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

import { getWfoArrayFieldStyles } from './styles';

export const MinusButton = ({
    index,
    onRemove,
    testId,
}: {
    index: number;
    onRemove: (index: number) => void;
    testId: string;
}) => {
    const { theme } = useOrchestratorTheme();
    const { minusButton } = getWfoArrayFieldStyles();

    return (
        <span css={minusButton} onClick={() => onRemove(index)}>
            <EuiIcon
                type="minus"
                size="xxl"
                color={theme.colors.danger}
                data-testid={testId}
            />
        </span>
    );
};

export const PlusButton = ({
    onClick,
    testId,
}: {
    onClick: () => void;
    testId: string;
}) => {
    const { theme } = useOrchestratorTheme();
    const { plusButtonWrapper } = getWfoArrayFieldStyles();

    return (
        <div css={plusButtonWrapper}>
            <EuiIcon
                onClick={onClick}
                type="plus"
                size="xxl"
                color={theme.colors.success}
                data-testid={testId}
            />
        </div>
    );
};

export const WfoArrayField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const config = useGetConfig();
    const reactHookForm = useGetForm();

    const disabled = pydanticFormField.attributes?.disabled || false;
    const { control } = reactHookForm;
    const { id: arrayName, arrayItem } = pydanticFormField;
    const { minItems, maxItems } = pydanticFormField.validations;
    const { container, fieldWrapper } = getWfoArrayFieldStyles();

    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });

    const showMinus = (!minItems || fields.length > minItems) && !disabled;
    const showPlus = (!maxItems || fields.length < maxItems) && !disabled;

    if (!arrayItem) return null;

    const component = fieldToComponentMatcher(
        arrayItem,
        config?.componentMatcherExtender,
    );

    const renderField = (field: Record<'id', string>, index: number) => {
        const itemizedField = itemizeArrayItem(index, arrayItem, arrayName);
        // We have decided - for now - on the convention that all descendants of disabled fields will be disabled as well
        // so we will not displaying any interactive elements inside a disabled element
        const arrayItemField = disabled
            ? disableField(itemizedField)
            : itemizedField;

        return (
            <div key={field.id} css={fieldWrapper}>
                <RenderFields
                    pydanticFormComponents={[
                        {
                            Element: component.Element,
                            pydanticFormField: arrayItemField,
                        },
                    ]}
                    extraTriggerFields={[arrayName]}
                />
                {showMinus && (
                    <MinusButton
                        index={index}
                        onRemove={remove}
                        testId={`${arrayName}-minus-button-${index}`}
                    />
                )}
            </div>
        );
    };

    return (
        <div data-testid={arrayName} css={container}>
            {fields.map(renderField)}

            {showPlus && (
                <PlusButton
                    onClick={() => {
                        append({
                            [arrayName]: arrayItem.default ?? undefined,
                        });
                    }}
                    testId={`${arrayName}-plus-button`}
                />
            )}
        </div>
    );
};
