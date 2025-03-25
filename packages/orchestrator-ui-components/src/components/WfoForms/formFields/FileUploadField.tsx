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
import React, { LegacyRef, useState } from 'react';

import { connectField, filterDOMProps } from 'uniforms';

import {
    EuiFilePicker,
    EuiFilePickerProps,
    EuiFormRow,
    EuiText,
} from '@elastic/eui';

import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { useWithOrchestratorTheme } from '@/hooks';
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
    const [uploadFile, { isLoading, reset }] = useUploadFileMutation();
    const [hasInValidFiletypes, setHasInValidFiletypes] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    const { allowed_file_types, url } = props.field;
    const filePickerRef: LegacyRef<
        Omit<EuiFilePickerProps, 'stylesMemoizer'> & { removeFiles: () => void }
    > = React.createRef();

    const handleError = () => {
        filePickerRef?.current?.removeFiles();
        setHasInValidFiletypes(false);
        setHasError(true);
    };

    const getInitialPromptText = () => {
        if (hasInValidFiletypes) {
            return `Allowed file types: ${allowed_file_types.join(', ')}`;
        }
        if (hasError) {
            return 'Error uploading file';
        }
        return 'Select or drag and drop a file';
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
                        ref={filePickerRef}
                        onChange={(files) => {
                            const file = files?.item(0) || null;
                            if (!file) return;

                            if (
                                file &&
                                allowed_file_types &&
                                !allowed_file_types.includes(file.type)
                            ) {
                                setHasInValidFiletypes(true);
                                setHasError(false);
                                filePickerRef?.current?.removeFiles();
                                return;
                            } else {
                                uploadFile({ url, file })
                                    .then((response) => {
                                        if (response.error) {
                                            handleError();
                                        } else {
                                            onChange(response?.data?.id);
                                        }
                                    })
                                    .catch((error) => {
                                        handleError();
                                        console.error(error);
                                    });
                                reset();
                            }
                        }}
                        isInvalid={hasError || hasInValidFiletypes}
                        display="large"
                        isLoading={isLoading}
                        initialPromptText={getInitialPromptText()}
                    />
                </>
            </EuiFormRow>
        </section>
    );
}

export const FileUploadField = connectField(FileUpload, { kind: 'leaf' });
