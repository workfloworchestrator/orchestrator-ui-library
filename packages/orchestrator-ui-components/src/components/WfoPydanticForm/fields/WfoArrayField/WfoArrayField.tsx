import React from 'react';
import { useFieldArray } from 'react-hook-form';

import {
    PydanticFormElementProps,
    RenderFields,
    fieldToComponentMatcher,
    itemizeArrayItem,
    usePydanticFormContext,
} from 'pydantic-forms';

import { EuiIcon } from '@elastic/eui';

import { getWfoArrayFieldStyles } from '@/components';
import { useOrchestratorTheme } from '@/hooks';

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
    const { config, rhf } = usePydanticFormContext();
    const { control } = rhf;
    const { id: arrayName, arrayItem } = pydanticFormField;
    const { minItems, maxItems } = pydanticFormField.validations;
    const { container, fieldWrapper } = getWfoArrayFieldStyles();

    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });

    const showMinus = !minItems || fields.length > minItems;
    const showPlus = !maxItems || fields.length < maxItems;

    if (!arrayItem) return null;

    const component = fieldToComponentMatcher(
        arrayItem,
        config?.componentMatcherExtender,
    );

    const renderField = (field: Record<'id', string>, index: number) => {
        const arrayField = itemizeArrayItem(index, arrayItem, arrayName);

        return (
            <div key={field.id} css={fieldWrapper}>
                <RenderFields
                    pydanticFormComponents={[
                        {
                            Element: component.Element,
                            pydanticFormField: arrayField,
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
