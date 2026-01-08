import { EuiThemeComputed } from '@elastic/eui';

import {
    FieldValue,
    ProcessStatus,
    ProductBlockInstance,
    SubscriptionAction,
    SubscriptionDetailProcess,
    WorkflowTarget,
} from '../../../types';
import {
    flattenArrayProps,
    getFieldFromProductBlockInstanceValues,
    getLastUncompletedProcess,
    getLatestTaskDate,
    getProductBlockTitle,
    getWorkflowTargetColor,
    getWorkflowTargetIconContent,
    mapProductBlockInstancesToEuiSelectableOptions,
    parseErrorDetail,
} from './utils';

describe('getFieldFromProductBlockInstanceValues()', () => {
    const instanceValues: FieldValue[] = [
        { field: 'field1', value: 'value1' },
        { field: 'field2', value: 'value2' },
    ];

    it('returns field value when field matches', () => {
        const result = getFieldFromProductBlockInstanceValues(
            instanceValues,
            'field1',
        );
        expect(result).toEqual('value1');
    });
    it('returns empty string when field is not found', () => {
        const result = getFieldFromProductBlockInstanceValues(
            instanceValues,
            'unknonw_field',
        );
        expect(result).toEqual('');
    });
});

describe('getProductBlockTitle()', () => {
    const instanceValues: FieldValue[] = [
        { field: 'field1', value: 'value1' },
        { field: 'field2', value: 'value2' },
    ];

    it('returns name value there is no title field', () => {
        const valuesWithName = [
            ...instanceValues,
            { field: 'name', value: 'name_value' },
        ];
        expect(getProductBlockTitle(valuesWithName)).toBe('name_value');
    });

    it('returns title field when there is a title field', () => {
        const valuesWithNameAndTitle = [
            ...instanceValues,
            { field: 'name', value: 'name_value' },
            { field: 'title', value: 'title_value' },
        ];
        expect(getProductBlockTitle(valuesWithNameAndTitle)).toBe(
            'title_value',
        );
    });

    it('returns empty string when there are no title or name fields', () => {
        expect(getProductBlockTitle(instanceValues)).toBe('');
    });
});

describe('flattenArrayProps', () => {
    it('should flatten an object with array values into a comma-separated string', () => {
        const action: SubscriptionAction = {
            name: 'action name',
            description: 'action description',
            usable_when: ['Status1', 'Status2', 'Status3'],
        };

        const result = flattenArrayProps(action);

        expect(result).toEqual({
            name: 'action name',
            description: 'action description',
            usable_when: 'Status1, Status2, Status3',
        });
    });

    it('should handle an object with non-array values', () => {
        const action: SubscriptionAction = {
            name: 'action name',
            description: 'action description',
        };
        const result = flattenArrayProps(action);
        expect(result).toEqual({
            name: 'action name',
            description: 'action description',
        });
    });
});

describe('getWorkflowTargetColor', () => {
    it('should return successText color for CREATE', () => {
        const theme = {
            colors: {
                successText: 'successTextColor',
            },
        } as EuiThemeComputed;

        expect(getWorkflowTargetColor(WorkflowTarget.CREATE, theme)).toBe(
            'successTextColor',
        );
    });

    it('should return textPrimary color for MODIFY', () => {
        const theme = {
            colors: {
                textPrimary: 'textPrimaryColor',
            },
        } as EuiThemeComputed;

        expect(getWorkflowTargetColor(WorkflowTarget.MODIFY, theme)).toBe(
            'textPrimaryColor',
        );
    });

    it('should return warning color for SYSTEM', () => {
        const theme = {
            colors: {
                warning: 'warningColor',
            },
        } as EuiThemeComputed;

        expect(getWorkflowTargetColor(WorkflowTarget.SYSTEM, theme)).toBe(
            'warningColor',
        );
    });

    it('should return danger color for TERMINATE', () => {
        const theme = {
            colors: {
                danger: 'dangerColor',
            },
        } as EuiThemeComputed;

        expect(getWorkflowTargetColor(WorkflowTarget.TERMINATE, theme)).toBe(
            'dangerColor',
        );
    });

    it('should return body color for unknown targets', () => {
        const theme = {
            colors: {
                body: 'bodyColor',
            },
        } as EuiThemeComputed;

        // Test with an unknown target
        expect(
            getWorkflowTargetColor('UNKNOWN_TARGET' as WorkflowTarget, theme),
        ).toBe('bodyColor');
    });
});

describe('getWorkflowTargetIconContent', () => {
    it('should return C for CREATE', () => {
        expect(getWorkflowTargetIconContent(WorkflowTarget.CREATE)).toBe('C');
    });

    it('should return T for SYSTEM', () => {
        expect(getWorkflowTargetIconContent(WorkflowTarget.SYSTEM)).toBe('T');
    });

    it('should return X for TERMINATE', () => {
        expect(getWorkflowTargetIconContent(WorkflowTarget.TERMINATE)).toBe(
            'X',
        );
    });

    it('should return M for unknown targets', () => {
        // Test with an unknown target
        expect(
            getWorkflowTargetIconContent('UNKNOWN_TARGET' as WorkflowTarget),
        ).toBe('M');
    });
});

const testProcess: SubscriptionDetailProcess = {
    workflowName: 'testWorkflow 1',
    lastStatus: ProcessStatus.COMPLETED,
    workflowTarget: WorkflowTarget.MODIFY,
    createdBy: 'testUser 1',
    processId: 'testProcessId 1',
    startedAt: '2021-01-01T00:00:00Z',
    isTask: false,
};

describe('getLastUncompletedProcess', () => {
    it('Returns empty string with empty process array', () => {
        const processes: SubscriptionDetailProcess[] = [];

        const getLastUncompletedProcessResult =
            getLastUncompletedProcess(processes);

        expect(getLastUncompletedProcessResult).toBe(undefined);
    });

    it('Return undefined string when there is only completed process', () => {
        const completedProcesses = [
            {
                ...testProcess,
                lastStatus: ProcessStatus.COMPLETED,
                startedAt: '2021-01-01T00:00:00Z',
            },
            {
                ...testProcess,
                lastStatus: ProcessStatus.COMPLETED,
                startedAt: '2021-02-01T00:00:00Z',
            },
            {
                ...testProcess,
                lastStatus: ProcessStatus.COMPLETED,
                startedAt: '2021-03-01T00:00:00Z',
            },
        ];

        const lastUncompletedProcess =
            getLastUncompletedProcess(completedProcesses);

        expect(lastUncompletedProcess).toBe(undefined);
    });
    it('Returns uncompleted process from list of processes', () => {
        const failedProcess = {
            ...testProcess,
            lastStatus: ProcessStatus.FAILED,
            processId: 'FAILED_PROCESS_ID',
            startedAt: '2021-02-01T00:00:00Z',
        };

        const failedProcesses = [
            {
                ...testProcess,
                lastStatus: ProcessStatus.COMPLETED,
                startedAt: '2021-01-01T00:00:00Z',
            },
            failedProcess,
            {
                ...testProcess,
                lastStatus: ProcessStatus.COMPLETED,
                startedAt: '2021-03-01T00:00:00Z',
            },
        ];

        const lastUncompletedProcess =
            getLastUncompletedProcess(failedProcesses);

        expect(lastUncompletedProcess?.processId).toBe('FAILED_PROCESS_ID');
    });

    it('Returns last failed process if there are more uncompleted processes', () => {
        const failedProcess = {
            ...testProcess,
            lastStatus: ProcessStatus.FAILED,
            processId: 'FAILED_PROCESS_1',
            startedAt: '2021-02-01T00:00:00Z',
        };

        const failedProcess2 = {
            ...testProcess,
            lastStatus: ProcessStatus.SUSPENDED,
            processId: 'FAILED_PROCESS_ID_2',
            startedAt: '2021-04-01T00:00:00Z',
        };

        const failedProcesses = [
            {
                ...testProcess,
                lastStatus: ProcessStatus.COMPLETED,
                startedAt: '2021-01-01T00:00:00Z',
            },
            failedProcess,
            {
                ...testProcess,
                lastStatus: ProcessStatus.COMPLETED,
                startedAt: '2021-03-01T00:00:00Z',
            },
            failedProcess2,
        ];

        const lastUncompletedProcess =
            getLastUncompletedProcess(failedProcesses);

        expect(lastUncompletedProcess?.processId).toBe('FAILED_PROCESS_ID_2');
    });
});

describe('getLatestTaskDate', () => {
    it('Returns empty string on empty array', () => {
        const tasks: SubscriptionDetailProcess[] = [];

        const lastTask = getLatestTaskDate(tasks);

        expect(lastTask).toBe('');
    });

    it('Returns empty string if there are no tasks among the processes', () => {
        const workflowsOnly = [
            { ...testProcess, isTask: false },
            { ...testProcess, isTask: false },
        ];

        const lastTask = getLatestTaskDate(workflowsOnly);

        expect(lastTask).toBe('');
    });

    it('Returns date of tasks among the processes', () => {
        const workflowsAndTask = [
            { ...testProcess, isTask: false },
            { ...testProcess, isTask: true, startedAt: '2021-01-01T00:00:00Z' },
            { ...testProcess, isTask: false },
        ];

        const lastTaskDate = getLatestTaskDate(workflowsAndTask);

        expect(lastTaskDate).toBe('2021-01-01T00:00:00Z');
    });

    it('Returns date of last task among the processes if there are more tasks', () => {
        const workflowsAndTask = [
            {
                ...testProcess,
                isTask: false,
                startedAt: '2021-01-01T00:00:00Z',
            },
            { ...testProcess, isTask: true, startedAt: '2021-02-01T00:00:00Z' },
            {
                ...testProcess,
                isTask: false,
                startedAt: '2021-03-01T00:00:00Z',
            },
            { ...testProcess, isTask: true, startedAt: '2021-04-01T00:00:00Z' },
        ];

        const lastTaskDate = getLatestTaskDate(workflowsAndTask);

        expect(lastTaskDate).toBe('2021-04-01T00:00:00Z');
    });
});

describe('mapProductBlockInstancesToEuiSelectableOptions', () => {
    const baseProductBlockInstance: Omit<
        ProductBlockInstance,
        'id' | 'productBlockInstanceValues'
    > = {
        subscriptionInstanceId: '',
        parent: null,
        inUseByRelations: [],
        subscription: {
            subscriptionId: '',
            description: '',
        },
    };

    it('maps product block instances to EuiSelectableOptions', () => {
        // Given
        const productBlockInstances: ProductBlockInstance[] = [
            {
                ...baseProductBlockInstance,
                id: 0,
                productBlockInstanceValues: [
                    {
                        field: 'name',
                        value: 'test1',
                    },
                ],
            },
            {
                ...baseProductBlockInstance,
                id: 1,
                productBlockInstanceValues: [
                    {
                        field: 'name',
                        value: 'test2',
                    },
                ],
            },
        ];

        // When
        const result = mapProductBlockInstancesToEuiSelectableOptions(
            productBlockInstances,
        );

        // Then
        expect(result).toEqual([
            {
                label: 'test1',
                data: {
                    ids: [0],
                },
            },
            {
                label: 'test2',
                data: {
                    ids: [1],
                },
            },
        ]);
    });

    it('maps product block instances to EuiSelectableOptions and groups ids by name', () => {
        // Given
        const productBlockInstances: ProductBlockInstance[] = [
            {
                ...baseProductBlockInstance,
                id: 0,
                productBlockInstanceValues: [
                    {
                        field: 'name',
                        value: 'test1',
                    },
                ],
            },
            {
                ...baseProductBlockInstance,
                id: 1,
                productBlockInstanceValues: [
                    {
                        field: 'name',
                        value: 'test2',
                    },
                ],
            },
            {
                ...baseProductBlockInstance,
                id: 2,
                productBlockInstanceValues: [
                    {
                        field: 'name',
                        value: 'test1',
                    },
                ],
            },
        ];

        // When
        const result = mapProductBlockInstancesToEuiSelectableOptions(
            productBlockInstances,
        );

        // Then
        expect(result).toEqual([
            {
                label: 'test1',
                data: {
                    ids: [0, 2],
                },
            },
            {
                label: 'test2',
                data: {
                    ids: [1],
                },
            },
        ]);
    });
});

describe('parseErrorDetail', () => {
    it('parses a single UUID inside brackets', () => {
        const input =
            "Subscription 123 has still failed processes with id's: ['11111111-1111-1111-1111-111111111111']";

        const { failedIds, filteredInput } = parseErrorDetail(input);

        expect(failedIds).toEqual(['11111111-1111-1111-1111-111111111111']);
        expect(filteredInput).toBe(
            "Subscription 123 has still failed processes with id's:",
        );
    });

    it('parses multiple UUIDs inside brackets', () => {
        const input =
            "Failed processes: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222']";

        const { failedIds, filteredInput } = parseErrorDetail(input);

        expect(failedIds).toEqual([
            '11111111-1111-1111-1111-111111111111',
            '22222222-2222-2222-2222-222222222222',
        ]);
        expect(filteredInput).toBe('Failed processes:');
    });

    it('returns empty array when no brackets present', () => {
        const input = 'No failed processes.';

        const { failedIds, filteredInput } = parseErrorDetail(input);

        expect(failedIds).toEqual([]);
        expect(filteredInput).toBe('No failed processes.');
    });

    it('ignores extra spaces or commas inside brackets', () => {
        const input =
            "Errors: [ '11111111-1111-1111-1111-111111111111' , '22222222-2222-2222-2222-222222222222' ]";

        const { failedIds, filteredInput } = parseErrorDetail(input);

        expect(failedIds).toEqual([
            '11111111-1111-1111-1111-111111111111',
            '22222222-2222-2222-2222-222222222222',
        ]);
        expect(filteredInput).toBe('Errors:');
    });
});
