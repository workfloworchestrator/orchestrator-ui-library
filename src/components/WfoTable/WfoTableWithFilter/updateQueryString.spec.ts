import { updateQueryString } from './updateQueryString';

describe('updateQueryString', () => {
  it('adds a new field when the query string is empty', () => {
    const queryString = '';
    const fieldName = 'field1';
    const value = 'value1';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:value1');
  });

  it('adds a new field when the query string does not contain the field yet', () => {
    const queryString = 'field1:value1';
    const fieldName = 'field2';
    const value = 'value2';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:value1 field2:value2');
  });

  it('updates an existing field with a single value in the query string', () => {
    const queryString = 'field1:value1 field2:value2';
    const fieldName = 'field1';
    const value = 'value3';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:(value1|value3) field2:value2');
  });

  it('updates an existing field with with already 2 values in the query string', () => {
    const queryString = 'field1:(value1|value3) field2:value2';
    const fieldName = 'field1';
    const value = 'value4';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:(value1|value3|value4) field2:value2');
  });

  it('uses quotes when the added value contains spaces', () => {
    const queryString = 'field1:(value1|value3) field2:value2';
    const fieldName = 'field1';
    const value = 'value 4';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:(value1|value3|"value 4") field2:value2');
  });

  it('adds a new value to an exising field where one existing value contains spaces', () => {
    const queryString = 'field1:("value 1"|value3) field2:value2';
    const fieldName = 'field1';
    const value = 'value 4';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:("value 1"|value3|"value 4") field2:value2');
  });

  it('returns the same query string when the given field name is an empty string', () => {
    const queryString = 'field1:value1 field2:value2';
    const fieldName = 'field1';
    const value = '';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:value1 field2:value2');
  });

  it('returns the same query string when the given value is an empty string', () => {
    const queryString = 'field1:value1 field2:value2';
    const fieldName = '';
    const value = 'value 3';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:value1 field2:value2');
  });

  it('updates an existing field ignoring case in the field name', () => {
    const queryString = 'field1:value1 field2:value2';
    const fieldName = 'Field1';
    const value = 'value3';

    const result = updateQueryString(queryString, fieldName, value);

    expect(result).toBe('field1:(value1|value3) field2:value2');
  });
});
