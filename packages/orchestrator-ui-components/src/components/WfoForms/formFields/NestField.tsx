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

import {
    EuiDescribedFormGroup,
    EuiFlexGroup,
    EuiFlexItem,
    EuiText,
} from '@elastic/eui';
import React from 'react';
import { connectField, filterDOMProps, joinName } from 'uniforms';
import { AutoField } from 'uniforms-unstyled';
import { FieldProps } from './types';

export type NestFieldProps = FieldProps<
    null,
    { fields?: unknown[]; itemProps?: object }
>;

declare module 'uniforms' {
    interface FilterDOMProps {
        properties: never;
    }
}
filterDOMProps.register('properties');

function Nest({
    children,
    fields,
    itemProps,
    label,
    description,
    name,
    className = '',
    ...props
}: NestFieldProps) {
    const nameArray = joinName(null, name);
    const lastNamePart = nameArray[nameArray.length - 1];
    const isInList = !isNaN(parseInt(lastNamePart));
    const itemIndex = isInList ? parseInt(lastNamePart) : 0;

    if (isInList) {
        return (
            // @ts-ignore
            <EuiFlexGroup
                {...filterDOMProps(props)}
                className={`${className} nest-field`}
            >
                {label && (
                    <>
                        <label className="euiFormLabel euiFormRow__label">
                            {label}
                        </label>
                        <EuiText size="m">{description}</EuiText>
                    </>
                )}

                {children ||
                    fields?.map((field) => (
                        <EuiFlexItem key={field}>
                            <AutoField
                                name={field}
                                {...itemProps}
                                label={itemIndex === 0 ? undefined : false}
                            />
                        </EuiFlexItem>
                    ))}
            </EuiFlexGroup>
        );
    } else {
        return (
            <EuiDescribedFormGroup
                {...filterDOMProps(props)}
                title={<span>{label}</span>}
                description={description}
                className={`${className} nest-field`}
            >
                {children ||
                    fields?.map((field) => (
                        <AutoField
                            key={field}
                            name={field}
                            {...itemProps}
                            label={itemIndex === 0 ? undefined : false}
                        />
                    ))}
            </EuiDescribedFormGroup>
        );
    }
}

export const NestField = connectField(Nest);
