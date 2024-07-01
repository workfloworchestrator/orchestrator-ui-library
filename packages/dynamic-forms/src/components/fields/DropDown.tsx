/**
 * Dynamic Forms
 *
 * Dropdown component
 */
import { useCallback } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { z } from 'zod';

import {
    DropDown,
    DropDownOption,
} from '@some-ui-lib/dist/components/Form/DropDown';

import DfFieldWrap from '@/components/fields/Wrap';
import { DFFieldController } from '@/components/render/DfFieldController';
import { FormComponent, IDynamicFormField } from '@/types';

function DhfCtrldDropDown(dfFieldConfig: IDynamicFormField) {
    const options = dfFieldConfig.options.map((option) => ({
        label: option,
        value: option,
    }));

    return function DropDownField({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        const valueChange = useCallback(
            (option: DropDownOption) => {
                field.onChange(option.value, dfFieldConfig.id);
            },
            [field],
        );

        return (
            <DfFieldWrap field={dfFieldConfig}>
                <DropDown
                    onChange={valueChange}
                    options={options}
                    value={field.value ?? ''}
                    placeholder={'Maak een keuze'}
                    disabled={!!dfFieldConfig.attributes.disabled}
                    width={'100%'}
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
