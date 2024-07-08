/**
 * Dynamic Forms
 *
 * A simple text field with type number
 */
import React from 'react';
import {
    Controller,
    ControllerRenderProps,
    FieldValues,
} from 'react-hook-form';

import { z } from 'zod';

import { EuiFieldNumber } from '@elastic/eui';

import DfFieldWrap from '@/dynamic-forms/components/fields/Wrap';
import { useDynamicFormsContext } from '@/dynamic-forms/core';
import {
    FormComponent,
    IDFInputFieldProps,
    IDynamicFormField,
} from '@/dynamic-forms/types';

function DhfCtrldTextField(dfFieldConfig: IDynamicFormField) {
    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        return (
            <DfFieldWrap field={dfFieldConfig}>
                <EuiFieldNumber
                    onChange={(event) =>
                        field.onChange(parseInt(event.target.value))
                    }
                    value={field.value ?? ''}
                    type="number"
                    disabled={!!dfFieldConfig.attributes.disabled}
                />
            </DfFieldWrap>
        );
    };
}

function DFNumberFieldWrap({ field }: IDFInputFieldProps) {
    const { theReactHookForm } = useDynamicFormsContext();

    return (
        <Controller
            control={theReactHookForm.control}
            name={field.id}
            render={DhfCtrldTextField(field)}
        />
    );
}

const DFNumberField: FormComponent = {
    Element: DFNumberFieldWrap,
    validator: () => z.number(),
};

export default DFNumberField;
