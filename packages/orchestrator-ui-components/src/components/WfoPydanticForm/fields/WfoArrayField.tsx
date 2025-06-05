import { useEffect } from 'react';
import {
    fieldToComponentMatcher,
    itemizeArrayItem,
    PydanticFormElementProps, RenderFields,
    usePydanticFormContext,
} from 'pydantic-forms';
import { useFieldArray, useForm } from 'react-hook-form';
import React from 'react';

export const WfoArrayField = ({ pydanticFormField }: PydanticFormElementProps) => {
    const { config, rhf } = usePydanticFormContext();
    const { control } = rhf;
    const { id: arrayName, arrayItem } = pydanticFormField;
    const { minItems, maxItems } = pydanticFormField.validations;

    // const defaultValues = {
    //     [arrayName]: [
    //         {
    //             ...arrayItem?.default
    //         }
    //     ]
    // };
    // const { control } = useForm({
    //     defaultValues,
    // });
    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });

    // const {control} = useForm({
    //     defaultValues,
    // });

    console.log("FIELDS", fields);
    console.log("ARRAY ITEM", arrayItem);

    if (!arrayItem) return '';

    // if(fields.length === 0) {
    //     append({
    //         [arrayName]: arrayItem.default ?? undefined,
    //     });
    // }

    const component = fieldToComponentMatcher(
        arrayItem,
        config?.componentMatcher,
    );

    const renderField = (field: Record<'id', string>, index: number) => {
        const arrayField = itemizeArrayItem(index, arrayItem);

        return (
            <div
                key={field.id}
                style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                }}
            >
                <RenderFields
                    pydanticFormComponents={[
                        {
                            Element: component.Element,
                            pydanticFormField: arrayField,
                        },
                    ]}
                    extraTriggerFields={[arrayName]}
                />
                {(!minItems || (minItems && fields.length > minItems)) && (
                    <span style={{width: '20px'}} onClick={() => remove(index)}>-</span>
                )}
            </div>
        );
    };
const a = fields ? fields : [{id: "aa", name: "bb", email: "cc"}];
    return (
        <div
            style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
            {a.map(renderField)}

            {(!maxItems || (maxItems && fields.length < maxItems)) && (
                <div
                    onClick={() => {
                        append({
                            [arrayName]: arrayItem.default ?? undefined,
                        });
                    }}
                    style={{
                        cursor: 'pointer',
                        fontSize: '32px',
                        display: 'flex',
                        justifyContent: 'end',
                        marginBottom: '8px',
                        padding: '16px',
                    }}
                >
                    +
                </div>
            )}
        </div>
    );
};
