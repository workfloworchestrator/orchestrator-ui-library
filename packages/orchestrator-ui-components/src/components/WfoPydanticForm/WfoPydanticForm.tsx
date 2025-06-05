import React from 'react';

import { AbstractIntlMessages, useMessages, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import type {
    ComponentMatcher,
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';
import {
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    zodValidationPresets,
} from 'pydantic-forms';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { PATH_TASKS, PATH_WORKFLOWS, WfoLoading } from '@/components';
import { StartWorkflowPayload } from '@/pages/processes/WfoStartProcessPage';
import { HttpStatus } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { useAppSelector } from '@/rtk/hooks';
import { FormValidationError } from '@/types';

import { Footer } from './Footer';
import { Header } from './Header';
import { Row } from './Row';
import {
    Checkbox,
    Divider,
    Label,
    Radio,
    Summary,
    Text,
    TextArea,
} from './fields';

interface WfoPydanticFormProps {
    processName: string;
    startProcessPayload?: StartWorkflowPayload;
    isTask?: boolean;
}

interface StartProcessResponse {
    id: string;
}

export const WfoPydanticForm = ({
    processName,
    startProcessPayload,
    isTask,
}: WfoPydanticFormProps) => {
    const [startProcess] = useStartProcessMutation();
    const router = useRouter();
    const t = useTranslations('pydanticForms.userInputForm');
    const componentMatcher = useAppSelector(
        (state) => state.pydanticForm?.componentMatcher,
    );

    const translationMessages: AbstractIntlMessages = useMessages();
    const formTranslations =
        translationMessages?.pydanticForms &&
        typeof translationMessages?.pydanticForms !== 'string'
            ? translationMessages.pydanticForms.backendTranslations
            : {};
    const widgetsTranslations =
        translationMessages?.pydanticForms &&
        typeof translationMessages?.pydanticForms !== 'string'
            ? translationMessages.pydanticForms.widgets
            : {};

    const onSuccess = (_fieldValues: object, req: object) => {
        const request = req as { response: StartProcessResponse };
        const response = request ? request?.response : null;
        if (response?.id) {
            const pfBasePath = isTask ? PATH_TASKS : PATH_WORKFLOWS;
            router.replace(`${pfBasePath}/${response.id}`);
        }
    };

    const getPydanticFormProvider = () => {
        const pydanticFormProvider: PydanticFormApiProvider = async ({
            requestBody = [],
            formKey,
        }) => {
            const response = startProcess({
                workflowName: formKey,
                userInputs: [{ ...startProcessPayload }, ...requestBody],
            });
            return response
                .then((result) => {
                    return new Promise<Record<string, object | string>>(
                        (resolve) => {
                            if (result.error) {
                                const error =
                                    result.error as FetchBaseQueryError;
                                if (
                                    error.status === HttpStatus.FormNotComplete
                                ) {
                                    const data = error.data as Record<
                                        string,
                                        object | string
                                    >;
                                    resolve(data);
                                } else if (
                                    typeof error === 'object' &&
                                    error !== null
                                ) {
                                    const validationError =
                                        error as FormValidationError;
                                    if (validationError?.status === 400) {
                                        resolve({
                                            ...validationError.data,
                                            status: validationError.status.toString(),
                                        });
                                    }
                                }
                            } else if (result.data) {
                                resolve(result.data);
                            }

                            resolve({});
                        },
                    );
                })
                .catch((error) => {
                    return new Promise<Record<string, object>>(
                        (resolve, reject) => {
                            if (error.status === HttpStatus.FormNotComplete) {
                                resolve(error.data);
                            }
                            reject(error);
                        },
                    );
                });
        };

        return pydanticFormProvider;
    };

    const orchestratorTranslations = formTranslations as unknown;

    const pydanticLabelProvider: PydanticFormLabelProvider = async () => {
        return new Promise((resolve) => {
            resolve({
                labels: {
                    ...(orchestratorTranslations as object),
                },
                data: {},
            });
        });
    };

    const wfoComponentMatcher: ComponentMatcher = (currentMatchers) => {
        const wfoMatchers: PydanticComponentMatcher[] = [
            {
                id: 'textarea',
                ElementMatch: {
                    Element: TextArea,
                    isControlledElement: true,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.format === PydanticFormFieldFormat.LONG
                    );
                },
            },
            {
                id: 'summary',
                ElementMatch: {
                    Element: Summary,
                    isControlledElement: false,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        (field.format as string) === 'summary'
                    );
                },
            },
            {
                id: 'label',
                ElementMatch: {
                    Element: Label,
                    isControlledElement: false,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.format === PydanticFormFieldFormat.LABEL
                    );
                },
            },
            {
                id: 'divider',
                ElementMatch: {
                    Element: Divider,
                    isControlledElement: false,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.format === PydanticFormFieldFormat.DIVIDER
                    );
                },
            },
            {
                id: 'checkbox',
                ElementMatch: {
                    Element: Checkbox,
                    isControlledElement: true,
                },
                matcher(field) {
                    return field.type === PydanticFormFieldType.BOOLEAN;
                },
            },
            {
                id: 'radio',
                ElementMatch: {
                    Element: Radio,
                    isControlledElement: true,
                },
                matcher(field) {
                    // We are looking for a single value from a set list of options. With less than 4 options, use radio buttons.
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.options.length > 0 &&
                        field.options.length <= 3
                    );
                },
            },
            ...currentMatchers.filter((matcher) => matcher.id !== 'text'),
            {
                id: 'text',
                ElementMatch: {
                    Element: Text,
                    isControlledElement: true,
                },
                matcher(field) {
                    return field.type === PydanticFormFieldType.STRING;
                },
                validator: zodValidationPresets.string,
            },
        ];

        return componentMatcher ? componentMatcher(wfoMatchers) : wfoMatchers;
    };

    const handleCancel = () => {
        const pfBasePath = isTask ? PATH_TASKS : PATH_WORKFLOWS;
        router.replace(pfBasePath);
    };

    return (
        <PydanticForm
            id={processName}
            onSuccess={onSuccess}
            onCancel={handleCancel}
            loadingComponent={<WfoLoading />}
            config={{
                apiProvider: getPydanticFormProvider(),
                allowUntouchedSubmit: true,
                footerRenderer: Footer,
                headerRenderer: Header,
                skipSuccessNotice: true,
                componentMatcher: wfoComponentMatcher,
                labelProvider: pydanticLabelProvider,
                rowRenderer: Row,
                customTranslations: {
                    cancel: t('cancel'),
                    startWorkflow: t('startWorkflow'),
                    widgets: {
                        ...(widgetsTranslations as object),
                    },
                    ...translationMessages,
                },
            }}
        />
    );
};
