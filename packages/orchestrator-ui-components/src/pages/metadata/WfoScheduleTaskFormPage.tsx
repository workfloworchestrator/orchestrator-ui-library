import React from 'react';

import _ from 'lodash';
import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/router';
import {
    PydanticForm,
    PydanticFormApiResponseType,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
import type {
    PydanticFormApiProvider,
    PydanticFormDefinitionResponse,
    PydanticFormPropertySchemaRawJson,
    PydanticFormSuccessResponse,
    RawJsonProperties,
} from 'pydantic-forms';

import { Footer, WfoContentHeader, WfoLoading } from '@/components';
import { useGetPydanticFormsConfig } from '@/hooks';
import { useGetTaskOptionsQuery } from '@/rtk';

/* 
apscheduler.triggers.interval
Parameters:
weeks (int) – number of weeks to wait
days (int) – number of days to wait
hours (int) – number of hours to wait
minutes (int) – number of minutes to wait
seconds (int) – number of seconds to wait
start_date (datetime|str) – starting point for the interval calculation
end_date (datetime|str) – latest possible date/time to trigger on
timezone (datetime.tzinfo|str) – time zone to use for the date/time calculations
jitter (int|None) – delay the job execution by jitter seconds at most
*/

/*
apscheduler.triggers.date
Parameter:
run_date (datetime|str) – the date/time to run the job at
timezone (datetime.tzinfo|str) – time zone for run_date if it doesn’t have one already
*/

/*
apscheduler.triggers.cron
Triggers when current time matches all specified time constraints, similarly to how the UNIX cron scheduler works.

Parameters:
year (int|str) – 4-digit year
month (int|str) – month (1-12)
day (int|str) – day of month (1-31)
week (int|str) – ISO week (1-53)
day_of_week (int|str) – number or name of weekday (0-6 or mon,tue,wed,thu,fri,sat,sun)
hour (int|str) – hour (0-23)
minute (int|str) – minute (0-59)
second (int|str) – second (0-59)
start_date (datetime|str) – earliest possible date/time to trigger on (inclusive)
end_date (datetime|str) – latest possible date/time to trigger on (inclusive)
timezone (datetime.tzinfo|str) – time zone to use for the date/time calculations (defaults to scheduler timezone)
jitter (int|None) – delay the job execution by jitter seconds at most
*/

enum TaskType {
    ONCE = 'once',
    INTERVAL = 'interval',
    CRON = 'cron',
}

enum Intervals {
    ONE_HOUR = '1hour',
    TWO_HOURS = '2hours',
    FOUR_HOURS = '4hours',
    TWELVE_HOURS = '12hours',
    TWENTY4_HOURS = '24hours',
    ONE_WEEK = '1week',
    TWO_WEEKS = '2weeks',
    ONE_MONTH = '1months',
}

export const WfoScheduleTaskFormPage = () => {
    const t = useTranslations('metadata.scheduleTaskForm');
    const cronRegex =
        '^(?:(\\*|([0-5]?\\d))(?:\\/(\\d+))?\\s+){4}(?:(\\*|([0-5]?\\d))(?:\\/(\\d+))?\\s+)?(?:([0-9,/*\\-?LW#]+)(?:\\s+([0-9,/*\\-?LW#]+))?(?:\\s+([0-9,/*\\-?LW#]+))?)$';

    // const router = useRouter();
    const onSuccess = () => {
        console.log('SUCCESS!!!');
    };

    const createScheduledTask = (
        formInput: unknown,
    ): PydanticFormSuccessResponse => {
        // interval: week,days,hours,minutes,seconds,start_date
        // date: run_date, timezone
        // cron: _year,month,day,week,day_of_week,hour,minute,_second,start_date,timezone

        return {
            type: PydanticFormApiResponseType.SUCCESS,
            data: formInput as object,
            status: 222,
        };
    };

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

    const { data, isLoading } = useGetTaskOptionsQuery();

    const taskOptions =
        data?.startOptions.reduce((options, taskOption) => {
            if (taskOption.isAllowed) {
                return {
                    [taskOption.name]: taskOption.description,
                    ...options,
                };
            }
            return options;
        }, {}) || {};

    const formStep1: PydanticFormDefinitionResponse | undefined = isLoading
        ? undefined
        : {
              type: PydanticFormApiResponseType.FORM_DEFINITION,
              form: {
                  $defs: {
                      TaskTypeChoice: {
                          enum: ['once', 'recurring'],
                          options: {
                              [TaskType.ONCE]: t('taskTypeDate'),
                              [TaskType.INTERVAL]: t('taskTypeInterval'),
                              [TaskType.CRON]: t('taskTypeCron'),
                          },
                          title: t('selectTaskType'),
                          type: PydanticFormFieldType.STRING,
                      },
                      TasksEnum: {
                          enum: Object.keys(taskOptions),
                          options: taskOptions,
                          title: t('selectTask'),
                          type: PydanticFormFieldType.STRING,
                      },
                  },
                  type: PydanticFormFieldType.OBJECT,
                  properties: {
                      task: {
                          type: PydanticFormFieldType.STRING,
                          format: PydanticFormFieldFormat.DROPDOWN,
                          $ref: '#/$defs/TasksEnum',
                      },
                      taskType: {
                          type: PydanticFormFieldType.STRING,
                          format: PydanticFormFieldFormat.RADIO,
                          $ref: '#/$defs/TaskTypeChoice',
                      },
                  },
                  required: ['task', 'taskOption'],
              },
              meta: {
                  hasNext: true,
              },
          };

    const getStep2Defs = (
        step1Input: Record<string, Record<string, unknown>>,
    ) => {
        if (step1Input[0]['taskType'] === TaskType.INTERVAL) {
            return {
                IntervalEnum: {
                    options: {
                        [Intervals.ONE_HOUR]: t('1hour'),
                        [Intervals.TWO_HOURS]: t('2hours'),
                        [Intervals.FOUR_HOURS]: t('4hours'),
                        [Intervals.TWELVE_HOURS]: t('12hours'),
                        [Intervals.TWENTY4_HOURS]: t('24hours'),
                        [Intervals.ONE_WEEK]: t('1week'),
                        [Intervals.TWO_WEEKS]: t('2weeks'),
                        [Intervals.ONE_MONTH]: t('1month'),
                    },
                    title: t('selectTaskType'),
                    type: PydanticFormFieldType.STRING,
                },
            };
        }
        return {};
    };

    const getStep2Properties = (
        step1Input: Record<string, Record<string, unknown>>,
    ): RawJsonProperties => {
        const step2Properties: RawJsonProperties = {
            firstRunDate: {
                type: PydanticFormFieldType.NUMBER,
                format: PydanticFormFieldFormat.DATETIME,
                title: t('firstRunDate'),
                $ref: '',
                uniforms: {
                    showTimeSelect: true,
                },
            },
        };

        if (step1Input[0]['taskType'] === TaskType.INTERVAL) {
            step2Properties.schedule = {
                type: PydanticFormFieldType.STRING,
                format: PydanticFormFieldFormat.DROPDOWN,
                $ref: '#/$defs/IntervalEnum',
            };
        }
        if (step1Input[0]['taskType'] === TaskType.CRON) {
            step2Properties.schedule = {
                type: PydanticFormFieldType.STRING,
                format: PydanticFormFieldFormat.DEFAULT,
                pattern: cronRegex,
                $ref: '',
            };
        }

        return step2Properties;
    };

    const getApiProvider = (): PydanticFormApiProvider => {
        return ({ formKey, requestBody = [] }) => {
            return new Promise<Record<string, unknown>>((resolve) => {
                if (validateForm(requestBody)) {
                    const successResponse = createScheduledTask(requestBody);
                    return resolve(successResponse);
                } else if (validateStep1(requestBody)) {
                    const step2Properties = getStep2Properties(requestBody);
                    const form2Defs = getStep2Defs(requestBody);
                    const formStep2: PydanticFormDefinitionResponse = {
                        type: PydanticFormApiResponseType.FORM_DEFINITION,
                        form: {
                            type: PydanticFormFieldType.OBJECT,
                            properties: { ...step2Properties },
                            $defs: { ...form2Defs },
                        },
                        meta: {
                            hasNext: false,
                        },
                    };
                    resolve(formStep2);
                }

                resolve(formStep1);
            }).then((formDefinition) => {
                return formDefinition;
            });
        };
    };

    const config = useGetPydanticFormsConfig(getApiProvider, Footer);
    return (
        <>
            <WfoContentHeader title={t('newSchedule')} />
            {(isLoading && <WfoLoading />) || (
                <PydanticForm
                    formKey="add-schedule-key"
                    formId="add-schedule-id"
                    onSuccess={onSuccess}
                    config={config}
                />
            )}
        </>
    );
};
