import { getTypedFieldFromObject } from './getTypedFieldFromObject';

describe('getTypedFieldFromObject', () => {
    const test_object = {
        name: 'test',
        description: 'test description',
        number: 1,
    };

    it('should get field from object when it exists', () => {
        const field = getTypedFieldFromObject('name', test_object);
        expect(field).toEqual('name');
    });

    it('should return null when field does not exist in object', () => {
        const field_value = getTypedFieldFromObject('test', test_object);
        expect(field_value).toBeNull();
    });
});
