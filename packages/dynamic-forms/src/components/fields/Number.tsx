/**
 * Dynamic Forms
 *
 * A simple text field with type number
 */
import {
    Controller,
    ControllerRenderProps,
    FieldValues,
} from 'react-hook-form';

import { z } from 'zod';

import { TextField } from '@some-ui-lib/dist/components/Form/TextField';

import DfFieldWrap from '@/components/fields/Wrap';
import { useDynamicFormsContext } from '@/core';
import { FormComponent, IDFInputFieldProps, IDynamicFormField } from '@/types';

function DhfCtrldTextField(dfFieldConfig: IDynamicFormField) {
    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        return (
            <DfFieldWrap field={dfFieldConfig}>
                <TextField
                    value={field.value ?? ''}
                    onChangeValue={field.onChange}
                    type="number"
                    disabled={!!dfFieldConfig.attributes.disabled}
                />
            </DfFieldWrap>
        );
    };
}

function DFNumberFieldWrap({ field }: IDFInputFieldProps) {
    const { rhf } = useDynamicFormsContext();

    return (
        <Controller
            control={rhf.control}
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
