import React from 'react';

import { AbstractIntlMessages, useMessages, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import {
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
import type {
    ComponentMatcher,
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { PATH_TASKS, PATH_WORKFLOWS, WfoLoading } from '@/components';
import { StartWorkflowPayload } from '@/pages/processes/WfoStartProcessPage';
import { HttpStatus } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { useAppSelector } from '@/rtk/hooks';

import { Footer } from './Footer';
import { Row } from './Row';
import { Checkbox, Divider, Label, Text, TextArea } from './fields';

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

    const orchestratorTranslations = formTranslations as object as unknown;

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
            },
        ];

        return componentMatcher ? componentMatcher(wfoMatchers) : wfoMatchers;
    };

    return (
        <PydanticForm
            title={''}
            id={processName}
            onSuccess={onSuccess}
            loadingComponent={<WfoLoading />}
            config={{
                apiProvider: getPydanticFormProvider(),
                allowUntouchedSubmit: true,
                footerRenderer: Footer,
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
                },
            }}
        />
    );
};
