import React from 'react';

import { AbstractIntlMessages, useMessages, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import type {
    ComponentMatcherExtender,
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

import { PATH_TASKS, PATH_WORKFLOWS, WfoLoading } from '@/components';
import { StartWorkflowPayload } from '@/pages/processes/WfoStartProcessPage';
import { HttpStatus, isFetchBaseQueryError, isRecord } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { useAppSelector } from '@/rtk/hooks';

import { Footer } from './Footer';
import { Header } from './Header';
import { Row } from './Row';
import {
    Checkbox,
    Divider,
    Label,
    Summary,
    Text,
    TextArea,
    WfoArrayField,
    WfoObjectField,
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
    const componentMatcherExtender = useAppSelector(
        (state) => state.pydanticForm?.componentMatcherExtender,
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
                .then(({ error, data }) => {
                    return new Promise<Record<string, unknown>>((resolve) => {
                        if (
                            isFetchBaseQueryError(error) &&
                            isRecord(error.data)
                        ) {
                            if (error.status === HttpStatus.FormNotComplete) {
                                resolve(error.data);
                            } else if (error.status === HttpStatus.BadRequest) {
                                resolve({
                                    ...error.data,
                                    status: error.status,
                                });
                            }
                        } else if (data) {
                            resolve(data);
                        }

                        resolve({});
                    });
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

    const wfoComponentMatcherExtender: ComponentMatcherExtender = (
        currentMatchers,
    ) => {
        const wfoMatchers: PydanticComponentMatcher[] = [
            ...currentMatchers
                .filter((matcher) => matcher.id !== 'text')
                .filter((matcher) => matcher.id !== 'array')
                .filter((matcher) => matcher.id !== 'object'),
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
                id: 'object',
                ElementMatch: {
                    isControlledElement: false,
                    Element: WfoObjectField,
                },
                matcher: (field) => {
                    return field.type === PydanticFormFieldType.OBJECT;
                },
            },
            {
                id: 'array',
                ElementMatch: {
                    isControlledElement: true,
                    Element: WfoArrayField,
                },
                matcher: (field) => {
                    return field.type === PydanticFormFieldType.ARRAY;
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
        return componentMatcherExtender
            ? componentMatcherExtender(wfoMatchers)
            : wfoMatchers;
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
                componentMatcherExtender: wfoComponentMatcherExtender,
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
