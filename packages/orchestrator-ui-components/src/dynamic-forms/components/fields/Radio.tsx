/**
 * Dynamic Forms
 *
 * Radio component
 *
 * Generates a list of radio options based on the options in the field config
 */
import React from 'react';
import { ChangeEvent, useRef } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { z } from 'zod';

import { EuiRadio } from '@elastic/eui';

import DfFieldWrap from '@/components/fields/Wrap';
import { DFFieldController } from '@/components/render/DfFieldController';
import { FormComponent, IDynamicFormField } from '@/types';

function DhfCtrldDFRadioField(dfFieldConfig: IDynamicFormField) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldValueRef = useRef<any[]>([]);

    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        if (field.value) fieldValueRef.current = field.value;

        function changeHandler(e: ChangeEvent<HTMLInputElement>) {
            field.onChange(e.target.value);
        }

        return (
            <DfFieldWrap field={dfFieldConfig}>
                {dfFieldConfig.options.map((option) => (
                    <EuiRadio
                        key={dfFieldConfig.id + option}
                        id={dfFieldConfig.id + option}
                        label={option}
                        checked={field.value === option}
                        value={option}
                        onChange={changeHandler}
                        name={dfFieldConfig.id}
                    />
                ))}
            </DfFieldWrap>
        );
    };
}

const DFRadioField: FormComponent = {
    Element: DFFieldController(DhfCtrldDFRadioField),
    validator: () => z.string(),
};

export default DFRadioField;
