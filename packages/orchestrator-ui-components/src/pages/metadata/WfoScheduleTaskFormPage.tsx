import React from 'react';

import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import {
    PydanticForm,
    PydanticFormApiResponseType,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
import type {
    PydanticFormApiProvider,
    PydanticFormDefinitionResponse,
    PydanticFormSuccessResponse,
    RawJsonProperties,
} from 'pydantic-forms';

import {
    Footer,
    PATH_METADATA_SCHEDULED_TASKS,
    WfoContentHeader,
    WfoLoading,
} from '@/components';
import { NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS } from '@/configuration';
import { useGetPydanticFormsConfig, useShowToastMessage } from '@/hooks';
import type { CronKwargs, ScheduledTaskPostPayload } from '@/rtk';
import { useCreateScheduledTaskMutation, useGetTasksQuery } from '@/rtk';
import { Intervals, TaskDefinition, TaskType, ToastTypes } from '@/types';

type CreateScheduleFormStep1 = {
    workflowId: TaskDefinition['workflowId'];
    taskType: TaskType;
};

type CreateScheduleFormStep2Once = {
    taskType: TaskType.DATE;
    startDate: string;
};
type CreateScheduleFormStep2Cron = {
    taskType: TaskType.CRON;
    startDate: string;
    cron: string;
};
type CreateScheduleFormStep2Interval = {
    taskType: TaskType.INTERVAL;
    startDate: string;
    interval: Intervals;
};

type CreateScheduleFormStep2 =
    | CreateScheduleFormStep2Once
    | CreateScheduleFormStep2Cron
    | CreateScheduleFormStep2Interval;

type CreateScheduleFormInput = [
    CreateScheduleFormStep1,
    CreateScheduleFormStep2,
];

export const WfoScheduleTaskFormPage = () => {
    const t = useTranslations('metadata.scheduleTaskForm');
    const { showToastMessage } = useShowToastMessage();

    const [createScheduledTask, mutationState] =
        useCreateScheduledTaskMutation();
    const { data, isLoading } = useGetTasksQuery({
        first: NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS,
        after: 0,
    });
    const router = useRouter();
    const { workflowId } = router.query;
    const getFormStep2 = (
        userInput: CreateScheduleFormInput,
    ): PydanticFormDefinitionResponse => {
        const getStep2Defs = () => ({
            IntervalEnum: {
                enum: [
                    Intervals.ONE_HOUR,
                    Intervals.TWO_HOURS,
                    Intervals.FOUR_HOURS,
                    Intervals.TWELVE_HOURS,
                    Intervals.TWENTY4_HOURS,
                    Intervals.ONE_WEEK,
                    Intervals.TWO_WEEKS,
                    Intervals.ONE_MONTH,
                ],
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
            ButtonColor: {
                enum: [
                    'primary',
                    'accent',
                    'success',
                    'warning',
                    'danger',
                    'ghost',
                    'text',
                ],
                options: {},
                title: 'ButtonColor',
                type: PydanticFormFieldType.STRING,
            },
            ButtonConfig: {
                additionalProperties: false,
                properties: {
                    text: {
                        title: 'Text',
                        type: PydanticFormFieldType.STRING,
                    },
                    dialog: {
                        title: 'Dialog',
                        type: PydanticFormFieldType.STRING,
                    },
                    color: {
                        $ref: '#/$defs/ButtonColor',
                    },
                },
                enum: [],
                title: 'ButtonConfig',
                options: {},
                type: PydanticFormFieldType.OBJECT,
            },
            Buttons: {
                additionalProperties: false,
                title: 'Buttons',
                type: PydanticFormFieldType.OBJECT,
                properties: {
                    previous: {
                        $ref: '#/$defs/ButtonConfig',
                    },
                    next: {
                        $ref: '#/$defs/ButtonConfig',
                    },
                },
                required: ['previous', 'next'],
                enum: [],
                options: {},
            },
        });

        const getStep2Properties = (
            userInput: CreateScheduleFormInput,
        ): RawJsonProperties => {
            const step1UserInput = userInput[0];

            const step2Properties: RawJsonProperties = {
                startDate: {
                    type: PydanticFormFieldType.NUMBER,
                    format: PydanticFormFieldFormat.DATETIME,
                    title: t('firstRunDate'),
                    $ref: '',
                    uniforms: {
                        showTimeSelect: true,
                    },
                },
            };

            if (step1UserInput.taskType === TaskType.INTERVAL) {
                step2Properties.interval = {
                    type: PydanticFormFieldType.STRING,
                    format: PydanticFormFieldFormat.DROPDOWN,
                    title: t('selectInterval'),
                    $ref: '#/$defs/IntervalEnum',
                };
            }
            if (step1UserInput.taskType === TaskType.CRON) {
                const cronRegex =
                    '^(?:(\\*|([0-5]?\\d))(?:\\/(\\d+))?\\s+){4}(?:(\\*|([0-5]?\\d))(?:\\/(\\d+))?\\s+)?(?:([0-9,/*\\-?LW#]+)(?:\\s+([0-9,/*\\-?LW#]+))?(?:\\s+([0-9,/*\\-?LW#]+))?)$';

                step2Properties.cron = {
                    type: PydanticFormFieldType.STRING,
                    format: PydanticFormFieldFormat.DEFAULT,
                    pattern: cronRegex,
                    $ref: '',
                };
            }

            return step2Properties;
        };

        const step2Properties = getStep2Properties(userInput);
        const form2Defs = getStep2Defs();
        const formStep2: PydanticFormDefinitionResponse = {
            type: PydanticFormApiResponseType.FORM_DEFINITION,
            form: {
                type: PydanticFormFieldType.OBJECT,
                properties: {
                    buttons: {
                        $ref: '#/$defs/Buttons',
                        default: {
                            previous: {},
                            next: { text: t('createScheduleButton') },
                        },
                        type: PydanticFormFieldType.OBJECT,
                        format: PydanticFormFieldFormat.HIDDEN,
                    },
                    ...step2Properties,
                },
                $defs: { ...form2Defs },
            },
            meta: {
                hasNext: false,
            },
            status: 510,
        };
        return formStep2;
    };

    const onSuccess = () => {
        router.replace(PATH_METADATA_SCHEDULED_TASKS);
    };

    const onCancel = () => {
        router.replace(PATH_METADATA_SCHEDULED_TASKS);
    };

    const getTaskByWorkflowId = (workflowId: TaskDefinition['workflowId']) => {
        return data?.tasks.find((task) => task.workflowId === workflowId);
    };

    const createTask = (
        userInput: CreateScheduleFormInput,
    ): PydanticFormSuccessResponse => {
        const getIntervalArg = (interval: Intervals) => {
            const intervalMap = new Map([
                [Intervals.ONE_HOUR, { hours: 1 }],
                [Intervals.TWO_HOURS, { hours: 2 }],
                [Intervals.FOUR_HOURS, { hours: 4 }],
                [Intervals.TWELVE_HOURS, { hours: 12 }],
                [Intervals.TWENTY4_HOURS, { hours: 24 }],
                [Intervals.ONE_WEEK, { weeks: 1 }],
                [Intervals.TWO_WEEKS, { weeks: 2 }],
                [Intervals.ONE_MONTH, { weeks: 4 }],
            ]);
            return intervalMap.has(interval)
                ? intervalMap.get(interval)
                : undefined;
        };

        const getCronKwargs = (cron: string, startDate: string): CronKwargs => {
            const [minute, hour, day, month, day_of_week] = cron.split(' ');

            return {
                start_date: startDate,
                minute: parseInt(minute, 10),
                hour: parseInt(hour, 10),
                day: parseInt(day, 10),
                month: parseInt(month, 10),
                day_of_week: parseInt(day_of_week, 10),
            };
        };

        const getCreateTaskPayload = (
            userInput: CreateScheduleFormInput,
        ): ScheduledTaskPostPayload => {
            const userInputStep1 = userInput[0];
            const userInputStep2 = userInput[1];

            if (!userInputStep1 || !userInputStep2) {
                throw new Error('Unknown or missing form input');
            }

            const startTimestampMilliseconds = parseInt(
                userInputStep2.startDate,
                10,
            );
            const startDate = new Date(
                startTimestampMilliseconds * 1000,
            ).toISOString();

            const task = getTaskByWorkflowId(userInputStep1.workflowId);

            if (!task) {
                throw Error('No task found with id');
            }

            if (userInputStep1.taskType === TaskType.DATE) {
                return {
                    type: userInputStep1.taskType,
                    workflowId: task.workflowId,
                    workflowDescription: task.description,
                    workflowName: task.name,
                    kwargs: {
                        run_date: startDate,
                    },
                };
            } else if (userInputStep1.taskType === TaskType.INTERVAL) {
                const step2Input =
                    userInputStep2 as CreateScheduleFormStep2Interval;
                const intervalArg = getIntervalArg(step2Input.interval);

                if (!intervalArg) {
                    throw new Error('Unknown or missing task interval');
                }

                return {
                    type: userInputStep1.taskType,
                    workflowId: task.workflowId,
                    workflowDescription: task.description,
                    workflowName: task.name,
                    kwargs: {
                        start_date: startDate,
                        ...intervalArg,
                    },
                };
            } else if (userInputStep1.taskType === TaskType.CRON) {
                const step2Input =
                    userInputStep2 as CreateScheduleFormStep2Cron;
                // minute hour day month weekday
                return {
                    type: userInputStep1.taskType,
                    workflowId: task.workflowId,
                    workflowDescription: task.description,
                    workflowName: task.name,
                    kwargs: getCronKwargs(step2Input.cron, startDate),
                };
            }
            throw new Error('Unknown or missing task type');
        };

        const createSchedulePayload = getCreateTaskPayload(userInput);
        createScheduledTask(createSchedulePayload);

        return {
            type: PydanticFormApiResponseType.SUCCESS,
            data: userInput,
            status: 201,
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

    const taskOptions =
        data?.tasks.reduce((options, taskOption) => {
            if (taskOption.isTask) {
                return {
                    [taskOption.workflowId]: taskOption.description,
                    ...options,
                };
            }
            return options;
        }, {}) || {};

    const formStep1: PydanticFormDefinitionResponse = {
        type: PydanticFormApiResponseType.FORM_DEFINITION,
        form: {
            $defs: {
                TaskTypeChoice: {
                    enum: ['once', 'recurring'],
                    options: {
                        [TaskType.DATE]: t('taskTypeDate'),
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
                workflowId: {
                    type: PydanticFormFieldType.STRING,
                    format: PydanticFormFieldFormat.DROPDOWN,
                    $ref: '#/$defs/TasksEnum',
                    default: workflowId as string,
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
        status: 510,
    };

    const getApiProvider = (): PydanticFormApiProvider => {
        return ({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            formKey,
            requestBody,
        }: {
            formKey: string;
            requestBody: CreateScheduleFormInput;
        }) => {
            const userInput = requestBody;
            return new Promise<Record<string, unknown>>((resolve) => {
                if (validateForm(userInput)) {
                    const successResponse = createTask(userInput);
                    return resolve(successResponse);
                } else if (validateStep1(userInput[0])) {
                    const formStep2 = getFormStep2(userInput);
                    resolve(formStep2);
                }

                resolve(formStep1);
            }).then((formDefinition) => {
                return formDefinition;
            });
        };
    };

    const config = useGetPydanticFormsConfig(getApiProvider, Footer);

    if (mutationState.isError) {
        showToastMessage(
            ToastTypes.ERROR,
            '',
            'Error while saving scheduled task',
        );
        console.error('Error saving scheduled task', mutationState);
        return undefined;
    }

    return (
        <>
            <WfoContentHeader title={t('newSchedule')} />
            {(isLoading && <WfoLoading />) || (
                <PydanticForm
                    formKey="add-schedule-key"
                    formId="add-schedule-id"
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    config={config}
                />
            )}
        </>
    );
};
