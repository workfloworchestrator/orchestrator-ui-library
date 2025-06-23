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
}: {
    index: number;
    onRemove: (index: number) => void;
}) => {
    const { theme } = useOrchestratorTheme();
    const { minusButton } = getWfoArrayFieldStyles();

    return (
        <span css={minusButton} onClick={() => onRemove(index)}>
            <EuiIcon type="minus" size="xxl" color={theme.colors.danger} />
        </span>
    );
};

export const PlusButton = ({ onClick }: { onClick: () => void }) => {
    const { theme } = useOrchestratorTheme();
    const { plusButtonWrapper } = getWfoArrayFieldStyles();

    return (
        <div css={plusButtonWrapper}>
            <EuiIcon
                onClick={onClick}
                type="plus"
                size="xxl"
                color={theme.colors.success}
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
        //TODO: Temporary fix for wrapper showing in arrayItem when not necessary
        delete arrayItem.description;
        arrayItem.title = '';
        const arrayField = itemizeArrayItem(index, arrayItem);

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
                {showMinus && <MinusButton index={index} onRemove={remove} />}
            </div>
        );
    };

    return (
        <div css={container}>
            {fields.map(renderField)}

            {showPlus && (
                <PlusButton
                    onClick={() => {
                        append({
                            [arrayName]: arrayItem.default ?? undefined,
                        });
                    }}
                />
            )}
        </div>
    );
};
