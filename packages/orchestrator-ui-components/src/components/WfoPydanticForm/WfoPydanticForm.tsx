import React, { useCallback, useMemo } from 'react';

import { AbstractIntlMessages, useMessages, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import type {
    ComponentMatcherExtender,
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';
import {
    Locale,
    PydanticForm,
    PydanticFormConfig,
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
    WfoArrayField,
    WfoCheckbox,
    WfoDivider,
    WfoDropdown,
    WfoInteger,
    WfoLabel,
    WfoMultiCheckboxField,
    WfoObjectField,
    WfoSummary,
    WfoText,
    WfoTextArea,
} from './fields';

interface WfoPydanticFormProps {
    processName: string;
    startProcessPayload?: StartWorkflowPayload;
    isTask?: boolean;
}

interface StartProcessResponse {
    id: string;
}

export const useWfoPydanticFormConfig = () => {
    const componentMatcherExtender = useAppSelector(
        (state) => state.pydanticForm?.componentMatcherExtender,
    );
    const t = useTranslations('pydanticForms.userInputForm');
    const translationMessages: AbstractIntlMessages = useMessages();

    const formTranslations =
        translationMessages?.pydanticForms &&
        typeof translationMessages?.pydanticForms !== 'string'
            ? translationMessages.pydanticForms.backendTranslations
            : {};

    const orchestratorTranslations = formTranslations as unknown;

    const pydanticLabelProvider =
        useCallback<PydanticFormLabelProvider>(async () => {
            return {
                labels: {
                    ...(orchestratorTranslations as object),
                },
                data: {},
            };
        }, [orchestratorTranslations]);

    const customTranslations = useMemo(() => {
        const widgetsTranslations =
            translationMessages?.pydanticForms &&
            typeof translationMessages?.pydanticForms !== 'string'
                ? translationMessages.pydanticForms.widgets
                : {};

        return {
            cancel: t('cancel'),
            startWorkflow: t('startWorkflow'),
            widgets: {
                ...(widgetsTranslations as object),
            },
            ...translationMessages,
        };
    }, [t, translationMessages]);

    const wfoComponentMatcherExtender = useCallback<ComponentMatcherExtender>(
        (currentMatchers) => {
            const wfoMatchers: PydanticComponentMatcher[] = [
                {
                    id: 'textarea',
                    ElementMatch: {
                        Element: WfoTextArea,
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
                        Element: WfoSummary,
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
                        Element: WfoLabel,
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
                        Element: WfoDivider,
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
                        Element: WfoCheckbox,
                        isControlledElement: true,
                    },
                    matcher(field) {
                        return field.type === PydanticFormFieldType.BOOLEAN;
                    },
                },
                {
                    id: 'dropdown',
                    ElementMatch: {
                        Element: WfoDropdown,
                        isControlledElement: true,
                    },
                    matcher(field) {
                        // We are looking for a single value from a set list of options.
                        // We are not using a radio button component to maintain being able to deselect options
                        return (
                            field.type === PydanticFormFieldType.STRING &&
                            Array.isArray(field.options) &&
                            field.options.length > 0
                        );
                    },
                },
                {
                    id: 'integerfield',
                    ElementMatch: {
                        Element: WfoInteger,
                        isControlledElement: true,
                    },
                    matcher(field) {
                        return field.type === PydanticFormFieldType.INTEGER;
                    },
                    validator: zodValidationPresets.integer,
                },
                {
                    id: 'multicheckbox',
                    ElementMatch: {
                        Element: WfoMultiCheckboxField,
                        isControlledElement: true,
                    },
                    matcher(field) {
                        return (
                            field.type === PydanticFormFieldType.ARRAY &&
                            field.options?.length > 0 &&
                            field.options?.length <= 5
                        );
                    },
                    validator: zodValidationPresets.multiSelect,
                },
                ...currentMatchers
                    .filter((matcher) => matcher.id !== 'text')
                    .filter((matcher) => matcher.id !== 'array')
                    .filter((matcher) => matcher.id !== 'object'),
                {
                    id: 'object',
                    ElementMatch: {
                        isControlledElement: false,
                        Element: WfoObjectField,
                    },
                    matcher: (field) =>
                        field.type === PydanticFormFieldType.OBJECT,
                },
                {
                    id: 'array',
                    ElementMatch: {
                        isControlledElement: true,
                        Element: WfoArrayField,
                    },
                    matcher: (field) =>
                        field.type === PydanticFormFieldType.ARRAY,
                },
                {
                    id: 'text',
                    ElementMatch: {
                        Element: WfoText,
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
        },
        [componentMatcherExtender],
    );

    return {
        wfoComponentMatcherExtender,
        pydanticLabelProvider,
        customTranslations,
    };
};

export const WfoPydanticForm = ({
    processName,
    startProcessPayload,
    isTask,
}: WfoPydanticFormProps) => {
    const [startProcess] = useStartProcessMutation();
    const router = useRouter();
    const {
        wfoComponentMatcherExtender,
        pydanticLabelProvider,
        customTranslations,
    } = useWfoPydanticFormConfig();

    const onSuccess = useCallback(
        (_fieldValues: object, req: object) => {
            const request = req as {
                status: HttpStatus;
                data: StartProcessResponse;
            };
            if (request?.data?.id) {
                const pfBasePath = isTask ? PATH_TASKS : PATH_WORKFLOWS;
                router.replace(`${pfBasePath}/${request.data.id}`);
            }
        },
        [isTask, router],
    );

    const getPydanticFormProvider = useCallback(() => {
        const pydanticFormProvider: PydanticFormApiProvider = async ({
            requestBody = [],
            formKey,
        }) => {
            const userInputs = isTask
                ? [...requestBody]
                : [{ ...startProcessPayload }, ...requestBody];

            const response = startProcess({
                workflowName: formKey,
                userInputs,
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
                            resolve({
                                data,
                                status: HttpStatus.Created,
                            });
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
    }, [isTask, startProcess, startProcessPayload]);

    const handleCancel = useCallback(() => {
        const pfBasePath = isTask ? PATH_TASKS : PATH_WORKFLOWS;
        router.replace(pfBasePath);
    }, [isTask, router]);

    const config = useMemo((): PydanticFormConfig => {
        const getLocale = () => {
            if (router.locale) {
                return router.locale as Locale;
            }
            return Locale.enGB; // Default to enGB if no locale is set
        };

        return {
            apiProvider: getPydanticFormProvider(),
            footerRenderer: Footer,
            headerRenderer: Header,
            componentMatcherExtender: wfoComponentMatcherExtender,
            labelProvider: pydanticLabelProvider,
            rowRenderer: Row,
            customTranslations: customTranslations,
            loadingComponent: <WfoLoading />,
            locale: getLocale(),
        };
    }, [
        customTranslations,
        getPydanticFormProvider,
        pydanticLabelProvider,
        router.locale,
        wfoComponentMatcherExtender,
    ]);

    return (
        <PydanticForm
            formKey={processName}
            onSuccess={onSuccess}
            onCancel={handleCancel}
            config={config}
        />
    );
};
