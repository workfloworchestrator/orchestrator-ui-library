/**
 * Dynamic Forms
 *
 * Text component
 */
import React from 'react';
import {
    Controller,
    ControllerRenderProps,
    FieldValues,
} from 'react-hook-form';

import { EuiFieldText } from '@elastic/eui';

import DfFieldWrap from '@/dynamic-forms/components/fields/Wrap';
import { zodValidationPresets } from '@/dynamic-forms/components/zodValidations';
import { useDynamicFormsContext } from '@/dynamic-forms/core';
import {
    FormComponent,
    IDFInputFieldProps,
    IDynamicFormField,
} from '@/dynamic-forms/types';

function DhfCtrldTextField(dfFieldConfig: IDynamicFormField) {
    const { theReactHookForm } = useDynamicFormsContext();

    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        const changeHandle = (val: string) => {
            field.onChange(val);

            // it seems we need this because the 2nd error would get stale..
            // https://github.com/react-hook-form/react-hook-form/issues/8170
            // https://github.com/react-hook-form/react-hook-form/issues/10832
            theReactHookForm.trigger(field.name);
        };

        return (
            <DfFieldWrap field={dfFieldConfig}>
                <EuiFieldText
                    value={field.value ?? ''}
                    onChange={() => changeHandle}
                    onBlur={field.onBlur}
                    disabled={!!dfFieldConfig.attributes.disabled}
                />
            </DfFieldWrap>
        );
    };
}

const DFTextField: FormComponent = {
    Element: function DFFieldControllerWrap({ field }: IDFInputFieldProps) {
        const { theReactHookForm } = useDynamicFormsContext();

        return (
            <Controller
                name={field.id}
                control={theReactHookForm.control}
                render={DhfCtrldTextField(field)}
            />
        );
    },
    validator: zodValidationPresets.string,
};

export default DFTextField;
