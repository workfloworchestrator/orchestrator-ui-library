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
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { useUploadFileMutation } from '@/rtk/endpoints/fileUpload';
import { FieldProps } from '@/types';

export type FileUploadProps = FieldProps<string>;

function FileUpload({
    id,
    label,
    description,
    onChange,
    error,
    showInlineError,
    errorMessage,
    ...props
}: FileUploadProps) {
    const { theme } = useOrchestratorTheme();
    const [uploadFile, { isLoading, reset }] = useUploadFileMutation();
    const [hasInValidFiletypes, setHasInValidFiletypes] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [hasFileToBig, setHasFileToBig] = useState(false);

    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    const {
        allowed_file_types: allowedMimeTypes,
        url,
        filesize_limit: fileSizeLimit,
    } = props.field;
    const cimUrl =
        url.replace('/cim', '').replace('rfo-upload', 'upload-rfo-report') ||
        '';

    const resetErrors = () => {
        setHasInValidFiletypes(false);
        setHasError(false);
        setHasFileToBig(false);
    };

    const getErrorText = (): string => {
        if (hasInValidFiletypes) {
            return 'Invalid filetype!';
        }
        if (hasError) {
            return 'Error uploading file!';
        }
        if (hasFileToBig) {
            return `File to large. Maximum file size: ${fileSizeLimit}`;
        }
        return '';
    };

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

                            if (!file) return;

                            const { type, size } = file;

                            if (
                                allowedMimeTypes &&
                                !allowedMimeTypes.includes(type)
                            ) {
                                setHasInValidFiletypes(true);
                                setHasError(false);
                                return;
                            } else if (fileSizeLimit && size > fileSizeLimit) {
                                setHasFileToBig(true);
                                return;
                            } else {
                                uploadFile({ url: cimUrl, file })
                                    .then((response) => {
                                        if (response.error) {
                                            setHasInValidFiletypes(false);
                                            setHasError(true);
                                            return;
                                        } else {
                                            onChange('');
                                            resetErrors();
                                        }
                                    })
                                    .catch((error) => {
                                        setHasInValidFiletypes(false);
                                        setHasError(true);
                                        console.error(error);
                                        return;
                                    });
                                reset();
                            }
                        }}
                        isInvalid={
                            hasError || hasInValidFiletypes || hasFileToBig
                        }
                        display="large"
                        isLoading={isLoading}
                        initialPromptText="Select or drag and drop a file"
                    />
                    <div
                        css={{
                            color: theme.colors.danger,
                            marginTop: theme.size.base,
                            marginLeft: theme.size.xs,
                            fontWeight: theme.font.weight.semiBold,
                        }}
                    >
                        {getErrorText()}
                    </div>
                </>
            </EuiFormRow>
        </section>
    );
}

export const FileUploadField = connectField(FileUpload, { kind: 'leaf' });
