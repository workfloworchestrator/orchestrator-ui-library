/**
 * Dynamic Forms
 *
 * Dropdown component
 */
import React from 'react';
import { useCallback } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { z } from 'zod';

import { EuiSelect } from '@elastic/eui';
import type { EuiSelectOption } from '@elastic/eui';

import DfFieldWrap from '@/dynamic-forms/components/fields/Wrap';
import { DFFieldController } from '@/dynamic-forms/components/render/DfFieldController';
import { FormComponent, IDynamicFormField } from '@/dynamic-forms/types';

function DhfCtrldDropDown(dfFieldConfig: IDynamicFormField) {
    const options: EuiSelectOption[] = dfFieldConfig.options.map((option) => ({
        text: option,
        value: option,
    }));

    return function DropDownField({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        const valueChange = useCallback(
            (option: EuiSelectOption) => {
                field.onChange(option.value, dfFieldConfig.id);
            },
            [field],
        );

        return (
            <DfFieldWrap field={dfFieldConfig}>
                <EuiSelect
                    onChange={() => valueChange}
                    options={options}
                    value={field.value ?? ''}
                    disabled={!!dfFieldConfig.attributes.disabled}
                />
            </DfFieldWrap>
        );
    };
}

const DFDropDown: FormComponent = {
    Element: DFFieldController(DhfCtrldDropDown),
    validator: () => z.string(),
};

export default DFDropDown;
