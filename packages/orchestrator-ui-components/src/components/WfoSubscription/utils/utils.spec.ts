import { EuiThemeComputed } from '@elastic/eui';

import { SubscriptionAction } from '../../../hooks';
import {
    FieldValue,
    ProcessStatus,
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

    it("returns '[title]...'  when title field is to long", () => {
        const longTitle =
            'title_value title_value title_value title_value title_value';
        const valuesWithNameAndLongTitle = [
            ...instanceValues,
            { field: 'name', value: 'name_value' },
            { field: 'title', value: longTitle },
        ];
        expect(getProductBlockTitle(valuesWithNameAndLongTitle)).toBe(
            'title_value title_value title_value title_val...',
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

    it('should return primaryText color for MODIFY', () => {
        const theme = {
            colors: {
                primaryText: 'primaryTextColor',
            },
        } as EuiThemeComputed;

        expect(getWorkflowTargetColor(WorkflowTarget.MODIFY, theme)).toBe(
            'primaryTextColor',
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
        expect(getLastUncompletedProcess([])).toBe(undefined);
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
        expect(getLastUncompletedProcess(completedProcesses)).toBe(undefined);
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
        expect(getLastUncompletedProcess(failedProcesses)?.processId).toBe(
            'FAILED_PROCESS_ID',
        );
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
        expect(getLastUncompletedProcess(failedProcesses)?.processId).toBe(
            'FAILED_PROCESS_ID_2',
        );
    });
});

describe('getLatestTaskDate', () => {
    it('Returns empty string on empty array', () => {
        expect(getLatestTaskDate([])).toBe('');
    });

    it('Returns empty string if there are no tasks among the processes', () => {
        const workflowsOnly = [
            { ...testProcess, isTask: false },
            { ...testProcess, isTask: false },
        ];

        expect(getLatestTaskDate(workflowsOnly)).toBe('');
    });

    it('Returns date of tasks among the processes', () => {
        const workflowsAndTask = [
            { ...testProcess, isTask: false },
            { ...testProcess, isTask: true, startedAt: '2021-01-01T00:00:00Z' },
            { ...testProcess, isTask: false },
        ];

        expect(getLatestTaskDate(workflowsAndTask)).toBe(
            '2021-01-01T00:00:00Z',
        );
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

        expect(getLatestTaskDate(workflowsAndTask)).toBe(
            '2021-04-01T00:00:00Z',
        );
    });
});
