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

import { connectField, filterDOMProps } from 'uniforms';

import { EuiCheckbox, EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';

import { FieldProps } from '@/components';
import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { useWithOrchestratorTheme } from '@/hooks';

import { boolFieldStyling } from './BoolFieldStyling';

export type BoolFieldProps = FieldProps<boolean>;

function Bool({
    disabled,
    id,
    className = '',
    label,
    description,
    name,
    onChange,
    readOnly,
    value,
    error,
    showInlineError,
    errorMessage,
    ...props
}: BoolFieldProps) {
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    return (
        <EuiFlexItem css={boolFieldStyling}>
            <section
                {...filterDOMProps(props)}
                className={`${className} bool-field`}
            >
                <EuiFormRow
                    css={formRowStyle}
                    label={label}
                    labelAppend={<EuiText size="m">{description}</EuiText>}
                    error={showInlineError ? errorMessage : false}
                    isInvalid={error}
                    id={id}
                    fullWidth
                >
                    <EuiCheckbox
                        checked={value || false}
                        disabled={disabled}
                        id={id}
                        name={name}
                        label={label || <div>&nbsp;</div>}
                        onChange={() =>
                            !disabled && !readOnly && onChange(!value)
                        }
                    />
                </EuiFormRow>
            </section>
        </EuiFlexItem>
    );
}

export const BoolField = connectField(Bool, { kind: 'leaf' });
