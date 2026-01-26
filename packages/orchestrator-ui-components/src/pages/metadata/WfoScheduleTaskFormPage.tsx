import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import {
    Locale,
    PydanticForm,
    PydanticFormApiResponseType,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
import type {
    PydanticFormApiProvider,
    PydanticFormConfig,
    PydanticFormDefinitionResponse,
    PydanticFormSuccessResponse,
} from 'pydantic-forms';

import { EuiSpacer } from '@elastic/eui';

import { WfoContentHeader, WfoLoading } from '@/components';

export const WfoScheduleTaskFormPage = () => {
    const t = useTranslations('metadata.scheduledTasks');
    const router = useRouter();
    const onSuccess = () => {
        console.log('SUCCESS!!!');
    };

    const createScheduledTask = (
        formInput: unknown,
    ): PydanticFormSuccessResponse => ({
        type: PydanticFormApiResponseType.SUCCESS,
        data: formInput as object,
        status: 222,
    });

    const validateForm = (formInput: unknown): boolean => {
        if (
            !_.isEmpty(formInput) &&
            _.isArray(formInput) &&
            formInput.length === 2
        ) {
            return true;
        }
        return false;
    };

    const validateStep1 = (formInput: unknown): boolean => {
        return !_.isEmpty(formInput);
    };

    const formStep1: PydanticFormDefinitionResponse = {
        type: PydanticFormApiResponseType.FORM_DEFINITION,
        form: {
            type: PydanticFormFieldType.OBJECT,
            properties: {
                task: {
                    type: PydanticFormFieldType.STRING,
                    format: PydanticFormFieldFormat.DROPDOWN,
                    $ref: '',
                },
                taskType: {
                    type: PydanticFormFieldType.STRING,
                    format: PydanticFormFieldFormat.RADIO,
                    $ref: '',
                },
            },
        },
        meta: {
            hasNext: true,
        },
    };

    const formStep2: PydanticFormDefinitionResponse = {
        type: PydanticFormApiResponseType.FORM_DEFINITION,
        form: {
            type: PydanticFormFieldType.OBJECT,
            properties: {
                firstDate: {
                    type: PydanticFormFieldType.DATETIME,
                    format: PydanticFormFieldFormat.LONG,
                    $ref: '',
                },
                schedule: {
                    type: PydanticFormFieldType.STRING,
                    format: PydanticFormFieldFormat.DROPDOWN,
                    $ref: '',
                },
            },
        },
        meta: {
            hasNext: false,
        },
    };

    const pydanticFormProvider: PydanticFormApiProvider = ({
        _,
        requestBody = [],
    }) => {
        return new Promise<Record<string, unknown>>((resolve) => {
            if (validateForm(requestBody)) {
                const successResponse = createScheduledTask(requestBody);
                console.log('successPresone', successResponse);
                return resolve(successResponse);
            } else if (validateStep1(requestBody)) {
                resolve(formStep2);
            }
            resolve(formStep1);
        }).then((formDefinition) => {
            return formDefinition;
        });
    };

    const getConfig = (): PydanticFormConfig => {
        const getLocale = () => {
            if (router.locale) {
                return router.locale as Locale;
            }
            return Locale.enGB; // Default to enGB if no locale is set
        };

        return {
            apiProvider: pydanticFormProvider,
            // footerRenderer: (props) => <Footer {...props} isTask={isTask} />,
            // headerRenderer: Header,
            // componentMatcherExtender: wfoComponentMatcherExtender,
            // labelProvider: pydanticLabelProvider,
            // rowRenderer: Row,
            // customTranslations: customTranslations,
            loadingComponent: <WfoLoading />,
            locale: getLocale(),
        };
    };

    return (
        <>
            <WfoContentHeader title={t('addSchedule')} />
            <EuiSpacer size="l" />
            <PydanticForm
                formKey="add-schedule"
                formId="add-schedule"
                onSuccess={onSuccess}
                title="TEMP TITLE"
                config={getConfig()}
            />
        </>
    );
};
