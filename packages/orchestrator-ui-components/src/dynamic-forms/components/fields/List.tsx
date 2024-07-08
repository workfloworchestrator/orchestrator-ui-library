/**
 * Dynamic Forms
 *
 * A list component, currently only supports string children
 *
 * to enable more types we need to store the required type in schemaToFieldTypes,
 * and use the correct sub component here based on the definition in field
 */
import React from 'react';
import { useRef } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { z } from 'zod';

import { EuiButton, EuiFieldText } from '@elastic/eui';

import DfFieldWrap from '@/components/fields/Wrap';
import { DFFieldController } from '@/components/render/DfFieldController';
import { zodValidationPresets } from '@/components/zodValidations';
import { getFieldAllOfAnyOfEntry } from '@/core/helper';
import {
    DfFieldTypes,
    FormComponent,
    IDynamicFormField,
    ListFieldType,
} from '@/types';

const getFieldDefaultValueByType = (type: DfFieldTypes) => {
    switch (type) {
        case DfFieldTypes.STRING:
            return '';
        case DfFieldTypes.DATE:
            return new Date();
        case DfFieldTypes.NUMBER:
            return 0;
    }
};

const getListFieldType = (dfFieldConfig: IDynamicFormField): ListFieldType => {
    // this is pretty dirty bit where we dive into the original field.
    // we do this because the type key is used at the top level as array,
    // but also at the lower level. Since we check these by ?? we dont have the lower
    // level type. But for this field, that is actually where the field type lives

    const getOptionsEntry = getFieldAllOfAnyOfEntry(dfFieldConfig.schemaField);

    const listFieldType = getOptionsEntry?.[0]?.items?.type;

    return listFieldType ?? DfFieldTypes.STRING;
};

function DhfCtrldDFListField(dfFieldConfig: IDynamicFormField) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldValueRef = useRef<any[]>([]);

    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        if (field.value) fieldValueRef.current = field.value;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldval = (field.value ?? []) as any[];
        const fieldType = getListFieldType(dfFieldConfig);

        function listChange(index: number) {
            return (value: string) => {
                fieldValueRef.current[index] = value;
                field.onChange(fieldValueRef.current);
            };
        }

        function addItem(index: number) {
            return () => {
                const targetIndex = Math.max(0, index + 1);
                fieldValueRef.current.splice(
                    targetIndex,
                    0,
                    getFieldDefaultValueByType(fieldType),
                );
                field.onChange(fieldValueRef.current);
            };
        }

        function removeItem(index: number) {
            return () => {
                field.onChange(
                    fieldValueRef.current.filter(
                        (item: unknown, ind: number) => ind !== index,
                    ),
                );
            };
        }

        return (
            <DfFieldWrap field={dfFieldConfig}>
                {fieldval.length ? (
                    fieldval.map((fieldValue, fieldIndex) => (
                        <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={`field-${dfFieldConfig.id}-${fieldIndex}`}
                            className="d-flex mv-2"
                        >
                            {fieldType === DfFieldTypes.STRING && (
                                <EuiFieldText
                                    value={fieldValue}
                                    onChange={() => listChange(fieldIndex)}
                                />
                            )}

                            {fieldType === DfFieldTypes.NUMBER && (
                                <EuiFieldText
                                    value={fieldValue}
                                    type="number"
                                    onChange={() => listChange(fieldIndex)}
                                />
                            )}

                            {fieldType === DfFieldTypes.DATE && (
                                <EuiFieldText
                                    value={fieldValue}
                                    type="date"
                                    onChange={() => listChange(fieldIndex)}
                                />
                            )}

                            <div className="d-flex ml-2">
                                <EuiButton
                                    onClick={addItem(fieldIndex)}
                                    type="button"
                                >
                                    +
                                </EuiButton>
                                <EuiButton
                                    onClick={removeItem(fieldIndex)}
                                    className="ml-1"
                                    type="button"
                                >
                                    -
                                </EuiButton>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        Nog geen rijen.{' '}
                        <EuiButton type="button" onClick={addItem(0)}>
                            Rij toevoegen
                        </EuiButton>
                    </div>
                )}
            </DfFieldWrap>
        );
    };
}

const DFListField: FormComponent = {
    Element: DFFieldController(DhfCtrldDFListField),
    validator: (field) => z.array(zodValidationPresets.string(field)),
};

export default DFListField;
