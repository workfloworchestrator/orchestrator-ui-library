/**
 * Dynamic Forms
 *
 * A mutliselect component
 *
 * expects and stores an array of strings
 */
import { useCallback } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { z } from 'zod';

import { MultiSelect, MultiSelectOption } from '@some-ui-lib';

import DfFieldWrap from '@/components/fields/Wrap';
import { DFFieldController } from '@/components/render/DfFieldController';
import { FormComponent, IDynamicFormField } from '@/types';

const getSelectOptions = (
    value: string | string[] | undefined,
    options: MultiSelectOption[],
): MultiSelectOption[] => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.map<MultiSelectOption>((val) => {
        const opt = options.find((option) => option.label === val);
        return opt ?? { label: 'fout', value: 'fout' };
    });
};

function DhfCtrldMultiSelect(dfFieldConfig: IDynamicFormField) {
    const options = dfFieldConfig.options.map((option) => ({
        label: option,
        value: option,
        isDisabled: !!dfFieldConfig.disabledOptions?.includes(option),
    }));

    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        const valueChange = useCallback(
            (options: MultiSelectOption[]) => {
                field.onChange(
                    options.map((option) => option.value),
                    dfFieldConfig.id,
                );
            },
            [field],
        );

        return (
            <DfFieldWrap field={dfFieldConfig}>
                <MultiSelect
                    options={options}
                    values={getSelectOptions(field.value, options)}
                    onChange={valueChange}
                    disabled={!!dfFieldConfig.attributes.disabled}
                />
            </DfFieldWrap>
        );
    };
}

const DFMultiSelect: FormComponent = {
    Element: DFFieldController(DhfCtrldMultiSelect),
    validator: () => z.array(z.string()),
};

export default DFMultiSelect;
