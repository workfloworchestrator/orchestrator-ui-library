// Four cases to consider when this function is called
// 1 - fieldName or value is empty
// 2 - queryString is empty
// 3 - fieldName does not exist in query string
// 4 - fieldName already exists in query string
export const updateQueryString = (
    queryString: string,
    fieldName: string,
    value: string,
) => {
    // 1 - Returning the exising query string when either fieldName or value is empty
    if (fieldName === '' || value === '') {
        return queryString;
    }

    // 2 - Empty query string returning directly fieldName:value
    if (queryString === '') {
        return `${fieldName}:${toQueryValue(value)}`;
    }

    // Finding fieldName with values in queryString in this order:
    // - Value surrounded with double quotes
    // field:"value"
    // - Value is surrounded with brackets
    // field:(value1|value2)
    // field:("value1 with spaces"|value2|value3)
    // - Value is a single word (no quotes and no brackets)
    // field:value
    const fieldRegex = new RegExp(
        String.raw`(${fieldName}):(".*?"|\(.*?\)|[^()|!:<>*"\s]+\*?)`,
        'i',
    );
    const match = queryString.match(fieldRegex);

    // 3 - Field name does not exist in query string yet, appending fieldName:value
    if (!match) {
        return `${queryString} ${fieldName}:${toQueryValue(value)}`;
    }

    // 4 - Field name already exists in query string as:
    const existingFieldName = match[1];
    const existingValue = getValueWithoutBrackets(match[2]);
    const updatedValue = `${existingValue}|${toQueryValue(value)}`;
    return queryString.replace(
        fieldRegex,
        `${existingFieldName}:(${updatedValue})`,
    );
};

const getValueWithoutBrackets = (value: string) => {
    if (value.startsWith('(') && value.endsWith(')')) {
        return value.slice(1, -1);
    }
    return value;
};

const hasSpaces = (value: string) => value.indexOf(' ') !== -1;

const toQueryValue = (value: string) =>
    hasSpaces(value) ? `"${value}"` : value;
