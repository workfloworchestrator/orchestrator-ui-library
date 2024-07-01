/**
 * Dynamic Forms
 *
 * Switch component
 *
 * Can use custom values.
 *
 * If custom value is set, it will also use those as labels and values
 */
import { ChangeEvent } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { z } from 'zod';

import { CheckSwitch } from '@some-ui-lib';

import DfFieldWrap from '@/components/fields/Wrap';
import { DFFieldController } from '@/components/render/DfFieldController';
import { DfFieldTypes, FormComponent, IDynamicFormField } from '@/types';

function DhfCtrldDFSwitchField(dfFieldConfig: IDynamicFormField) {
    const onLabel = dfFieldConfig.options?.[0];
    const offLabel = dfFieldConfig.options?.[1];

    const getActualValue = (state: boolean) => {
        if (typeof onLabel === undefined || typeof offLabel === undefined) {
            return state;
        }

        return state ? onLabel : offLabel;
    };

    const getBooleanValue = (value: string | boolean) => {
        if (typeof value === 'boolean') {
            return value;
        }

        if (onLabel) return value === onLabel;

        return false;
    };

    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
            // if the values are strings, they should be stored as strings
            field.onChange(getActualValue(e.target.checked));
        }

        // switch requires a boolean as checked value
        const isChecked = getBooleanValue(field.value);

        return (
            <DfFieldWrap field={dfFieldConfig}>
                <CheckSwitch
                    checked={isChecked}
                    onlabel={onLabel}
                    offlabel={offLabel}
                    disabled={!!dfFieldConfig.attributes.disabled}
                    onChange={onChangeHandler}
                />
            </DfFieldWrap>
        );
    };
}

const DFSwitchField: FormComponent = {
    Element: DFFieldController(DhfCtrldDFSwitchField),
    validator: (field) => {
        if (field.type === DfFieldTypes.BOOLEAN) {
            return z.boolean();
        }

        return z.string();
    },
};

export default DFSwitchField;
