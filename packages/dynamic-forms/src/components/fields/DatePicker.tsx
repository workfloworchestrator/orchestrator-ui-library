/**
 * Dynamic Forms
 *
 * Datepicker of rijkshuisstijl
 */
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import dayjs from 'dayjs';
import { z } from 'zod';

import { DatePicker } from '@some-ui-lib';

import DfFieldWrap from '@/components/fields/Wrap';
import { DFFieldController } from '@/components/render/DfFieldController';
import { FormComponent, IDynamicFormField } from '@/types';

const dateDisplayFormat = 'dd-MM-yyyy';
const dateBackendFormat = 'YYYY-MM-DD';

function DhfCtrldDFDatePicker(dfFieldConfig: IDynamicFormField) {
    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        const changeHandle = function (value: Date) {
            try {
                field.onChange(
                    dayjs(value, dateBackendFormat).format('YYYY-MM-DD'),
                );
            } catch (error) {
                console.error(error);
            }
        };

        return (
            <DfFieldWrap field={dfFieldConfig}>
                <DatePicker
                    dateFormat={dateDisplayFormat}
                    disabled={!!dfFieldConfig.attributes.disabled}
                    selected={
                        field.value
                            ? dayjs(field.value, dateBackendFormat).toDate()
                            : null
                    }
                    onChange={changeHandle}
                />
            </DfFieldWrap>
        );
    };
}

const DFDatePicker: FormComponent = {
    Element: DFFieldController(DhfCtrldDFDatePicker),
    validator: () => {
        return z.string();
    },
};

export default DFDatePicker;
