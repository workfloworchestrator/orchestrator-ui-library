import { SubscriptionAction } from '../../../hooks';
import { FieldValue, WorkflowTarget } from '../../../types';
import { EuiThemeComputed } from '@elastic/eui';

import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
    flattenArrayProps,
    getWorkflowTargetColor,
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
    it('should return primaryText color for CREATE and MODIFY', () => {
        const theme = {
            colors: {
                primaryText: 'primaryTextColor',
            },
        } as EuiThemeComputed;

        expect(getWorkflowTargetColor(WorkflowTarget.CREATE, theme)).toBe(
            'primaryTextColor',
        );
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
