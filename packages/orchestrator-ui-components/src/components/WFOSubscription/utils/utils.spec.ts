import { FieldValue } from '../../../types';
import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
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
