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
import React from 'react';

import { EuiFormRow, EuiText } from '@elastic/eui';
import type { EuiThemeComputed } from '@elastic/eui';
import { get } from 'lodash';
import { useTranslations } from 'next-intl';
import ReactSelect from 'react-select';
import {
    connectField,
    filterDOMProps,
    joinName,
    useField,
    useForm,
} from 'uniforms';

import { ListField, ListFieldProps } from './ListField';
import { ListItemField } from './ListItemField';
import { ListSelectField } from './ListSelectField';
import { FieldProps, Option } from './types';
import { useOrchestratorTheme } from '../../../hooks';

export type SelectFieldProps = FieldProps<
    string | string[],
    { allowedValues?: string[]; transform?(value: string): string }
>;

export const getReactSelectInnerComponentStyles = (theme: EuiThemeComputed) => {
    const reactSelectInnerComponentStyles = {
        option: (
            baseStyles: object,
            state: { isSelected: boolean; isDisabled: boolean },
        ) => ({
            ...baseStyles,
            borderBottom: theme.border.thin,
            backgroundColor: theme.colors.lightestShade,
            color: state.isSelected
                ? theme.colors.primaryText
                : theme.colors.text,
            cursor: state.isDisabled ? 'not-allowed' : 'default',
        }),
        control: (baseStyles: object) => ({
            ...baseStyles,
            backgroundColor: theme.colors.lightestShade,
            color: theme.colors.text,
            border: theme.border.thin,
        }),
        input: (baseStyles: object) => ({
            ...baseStyles,
            color: theme.colors.text,
        }),
        singleValue: (baseStyles: object, state: { isDisabled: boolean }) => {
            const opacity = state.isDisabled ? 0.3 : 1;
            const transition = 'opacity 300ms';
            return {
                ...baseStyles,
                opacity,
                transition,
                color: theme.colors.text,
            };
        },
        menu: (baseStyles: object) => ({
            ...baseStyles,
            backgroundColor: theme.colors.lightestShade,
        }),
    };

    return {
        reactSelectInnerComponentStyles,
    };
};

function Select({
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
    const { theme } = useOrchestratorTheme();
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
    const { reactSelectInnerComponentStyles } =
        getReactSelectInnerComponentStyles(theme);

    if (fieldType === Array) {
        // Avoid circular import with our own ListSelectField (instead of recursively trying to use SelectField)
        return (
            <ListField name={name}>
                <ListItemField name="$">
                    <ListSelectField
                        name=""
                        transform={transform}
                        allowedValues={allowedValues}
                    />
                </ListItemField>
            </ListField>
        );
    } else {
        return (
            <section {...filterDOMProps(props)}>
                <EuiFormRow
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
                                onChange(option?.value);
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

export const SelectField = connectField(Select);
