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
import React, { useState } from 'react';

import { connectField, filterDOMProps } from 'uniforms';

import { EuiFilePicker, EuiFormRow, EuiText } from '@elastic/eui';

import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { useWithOrchestratorTheme } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';
import { FieldProps } from '@/types';

export type FileUploadProps = FieldProps<string>;

function FileUpload({
    autoComplete,
    disabled,
    id,
    label,
    description,
    name,
    onChange,
    placeholder,
    readOnly,
    type,
    value,
    error,
    showInlineError,
    errorMessage,
    ...props
}: FileUploadProps) {
    const [isValidFieldType, setIsValidFieldType] = useState(true);
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    const { allowed_file_types, url } = props.field;

    return (
        <section {...filterDOMProps(props)}>
            <EuiFormRow
                css={formRowStyle}
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={showInlineError ? errorMessage : false}
                isInvalid={error}
                id={id}
                fullWidth
            >
                <>
                    <EuiFilePicker
                        onChange={(files) => {
                            const file = files?.item(0) || null;
                            if (
                                file &&
                                allowed_file_types &&
                                !allowed_file_types.includes(file.type)
                            ) {
                                setIsValidFieldType(false);
                                return;
                            } else {
                                setIsValidFieldType(true);
                            }
                            console.log('File uploaded', files);
                        }}
                        isInvalid={!isValidFieldType}
                        display="large"
                    />
                    {!isValidFieldType && (
                        <EuiText size="s">
                            {allowed_file_types
                                ? `Allowed file types: ${allowed_file_types.join(
                                      ', ',
                                  )}`
                                : null}
                        </EuiText>
                    )}
                </>
            </EuiFormRow>
        </section>
    );
}

FileUpload.defaultProps = { type: 'text' };

export const FileUploadField = connectField(FileUpload, { kind: 'leaf' });
