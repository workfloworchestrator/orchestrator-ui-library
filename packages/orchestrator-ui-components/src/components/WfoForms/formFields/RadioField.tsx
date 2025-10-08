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

import { omit } from 'lodash';
import { connectField, filterDOMProps } from 'uniforms';

import { EuiFormRow, EuiRadio, EuiText } from '@elastic/eui';

import { FieldProps } from '@/components';

const base64 =
    typeof btoa !== 'undefined'
        ? btoa
        : (x: string) => Buffer.from(x).toString('base64');
const escape = (x: string) => base64(encodeURIComponent(x)).replace(/=+$/, '');

export type RadioFieldProps = FieldProps<
    string,
    {
        allowedValues?: string[];
        checkboxes?: boolean;
        transform?(value: string): string;
    }
>;

function Radio({
    allowedValues,
    disabled,
    id,
    label,
    description,
    name,
    onChange,
    readOnly,
    transform,
    value,
    error,
    showInlineError,
    errorMessage,
    ...props
}: RadioFieldProps) {
    return (
        <div {...omit(filterDOMProps(props), ['checkboxes'])}>
            <EuiFormRow
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={showInlineError ? errorMessage : false}
                isInvalid={error}
                id={id}
                fullWidth
            >
                <>
                    {allowedValues?.map((item) => (
                        <EuiRadio
                            key={item}
                            id={`${id}-${escape(item)}`}
                            label={transform ? transform(item) : item}
                            disabled={disabled}
                            name={name}
                            checked={item === value}
                            onChange={() => {
                                if (!readOnly) {
                                    onChange(item);
                                }
                            }}
                        />
                    ))}
                </>
            </EuiFormRow>
        </div>
    );
}

export const RadioField = connectField(Radio, { kind: 'leaf' });
