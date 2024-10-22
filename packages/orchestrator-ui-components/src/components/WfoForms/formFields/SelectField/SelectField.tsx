/*
 * Copyright 2019-2023 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useEffect } from 'react';
import ReactSelect from 'react-select';

import { get } from 'lodash';
import { useTranslations } from 'next-intl';
import { joinName, useField, useForm } from 'uniforms';

import { EuiFormRow, EuiText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { ListField, ListFieldProps } from '../ListField';
import { ListItemField } from '../ListItemField';
import { ListSelectField } from '../ListSelectField';
import { FieldProps, Option } from '../types';
import { getSelectFieldStyles } from './styles';

export type SelectFieldProps = FieldProps<
    string | string[],
    { allowedValues?: string[]; transform?(value: string): string }
>;

/*

*/
export function UnconnectedSelectField({
    allowedValues = [],
    disabled,
    fieldType,
    id,
    label,
    description,
    name,
    onChange,
    placeholder,
    readOnly,
    transform,
    value,
    error,
    showInlineError,
    errorMessage,
    ...props
}: SelectFieldProps) {
    const t = useTranslations('pydanticForms');

    const nameArray = joinName(null, name);
    let parentName = joinName(nameArray.slice(0, -1));

    // We can't call useField conditionally so we call it for ourselves if there is no parent
    if (parentName === '') {
        parentName = name;
    }
    const parent = useField(parentName, {}, { absoluteName: true })[0];
    const { model } = useForm();

    if (parentName !== name) {
        if (
            parent.fieldType === Array &&
            (parent as ListFieldProps).uniqueItems
        ) {
            const allValues: string[] = get(model, parentName, []);
            const chosenValues = allValues.filter(
                (_item, index) =>
                    index.toString() !== nameArray[nameArray.length - 1],
            );

            allowedValues = allowedValues.filter(
                (value) => !chosenValues.includes(value),
            );
        }
    }
    const options = allowedValues.map((value: string) => ({
        label: transform ? transform(value) : value,
        text: transform ? transform(value) : value,
        value: value,
    }));

    const selectedValue = options.find(
        (option: Option) => option.value === value,
    );

    // React select allows callbacks to supply style for innercomponents: https://react-select.com/styles#inner-components
    const { reactSelectInnerComponentStyles, formRowStyle } =
        useWithOrchestratorTheme(getSelectFieldStyles);

    useEffect(() => {
        if (selectedValue && selectedValue.value !== 'undefined') {
            onChange(selectedValue.value);
        }
    }, [onChange, selectedValue]);

    if (fieldType === Array) {
        // Avoid circular import with our own ListSelectField (instead of recursively trying to use SelectField)
        return (
            <ListField name={name}>
                <ListItemField name="$">
                    <ListSelectField
                        {...{
                            allowedValues,
                            disabled,
                            fieldType,
                            id,
                            label,
                            description,
                            name,
                            onChange,
                            placeholder,
                            readOnly,
                            transform,
                            value,
                            error,
                            showInlineError,
                            errorMessage,
                        }}
                        fieldType={fieldType}
                        name=""
                        transform={transform}
                        allowedValues={allowedValues}
                        {...props}
                    />
                </ListItemField>
            </ListField>
        );
    } else {
        return (
            <section>
                <EuiFormRow
                    css={formRowStyle}
                    label={label}
                    labelAppend={<EuiText size="m">{description}</EuiText>}
                    error={showInlineError ? errorMessage : false}
                    isInvalid={error}
                    id={id}
                    fullWidth
                >
                    <ReactSelect<Option, false>
                        id={id}
                        inputId={`${id}.search`}
                        name={name}
                        onChange={(option) => {
                            if (!readOnly) {
                                // @ts-expect-error - null needs to be passed in some cases to remove something (eg. a fw endpoint in an l2vpn)
                                onChange(option?.value ?? null);
                            }
                        }}
                        styles={reactSelectInnerComponentStyles}
                        options={options}
                        value={selectedValue}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={
                            placeholder || t('widgets.select.placeholder')
                        }
                        isDisabled={disabled || readOnly}
                    />
                </EuiFormRow>
            </section>
        );
    }
}
