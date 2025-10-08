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
/* NOTE: This component is only needed to avoid the circular import that started to be a problem
after the upgrade to react-script 5.0. The original SelectField would import itself to handle the list:
that seems to be impossible with the new webpack.
 */
import React from 'react';

import { get } from 'lodash';
import { joinName, useField, useForm } from 'uniforms';

import { ListField, ListFieldProps } from './ListField';
import { ListItemField } from './ListItemField';
// Avoid circular deps
import { UnconnectedSelectField } from './SelectField';
import { FieldProps } from './types';

export type ListSelectFieldProps = FieldProps<
    string | string[],
    { allowedValues?: string[]; transform?(value: string): string }
>;

export function ListSelectField({
    allowedValues = [],
    fieldType,
    name,
    transform,
    ...props
}: ListSelectFieldProps) {
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

    if (fieldType === Array) {
        return (
            <ListField name={name}>
                <ListItemField name="$">
                    <UnconnectedSelectField
                        name=""
                        transform={transform}
                        allowedValues={allowedValues}
                        fieldType={fieldType}
                        {...props}
                    />
                </ListItemField>
            </ListField>
        );
    } else {
        return (
            <UnconnectedSelectField
                name=""
                transform={transform}
                allowedValues={allowedValues}
                fieldType={fieldType}
                {...props}
            />
        );
    }
}
