/*
 * Copyright 2024 SURF.
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

import { useTranslations } from 'next-intl';
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
    const t = useTranslations('pydanticForms.widgets.fileUpload');
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

    const cimUrl = url.replace('/cim', '');

    const resetErrors = () => {
        setHasInValidFiletypes(false);
        setHasError(false);
        setHasFileToBig(false);
    };

    const getErrorText = (): string => {
        if (hasInValidFiletypes) {
            return t('invalidFiletype');
        }
        if (hasError) {
            return t('errorUploading');
        }
        if (hasFileToBig) {
            return t('fileToBig', { fileSizeLimit });
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
                                resetErrors();
                                setHasInValidFiletypes(true);
                                return;
                            } else if (size > fileSizeLimit) {
                                resetErrors();
                                setHasFileToBig(true);
                                return;
                            } else {
                                uploadFile({ url: cimUrl, file })
                                    .then((response) => {
                                        if (response.error) {
                                            resetErrors();
                                            setHasError(true);
                                            return;
                                        } else {
                                            onChange('');
                                            resetErrors();
                                        }
                                    })
                                    .catch((error) => {
                                        resetErrors();
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
                        initialPromptText={t('initialPromptText')}
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
