const getValueWithoutBrackets = (value: string) => {
    if (value.startsWith('(') && value.endsWith(')')) {
        return value.slice(1, -1);
    }
    return value;
};

const isContainingSpaces = (value: string) => {
    return value.indexOf(' ') !== -1;
};

const toQueryValue = (value: string) => {
    return isContainingSpaces(value) ? `"${value}"` : value;
};

// Three cases to consider when this function is called
// 1 - queryString is empty
// 2 - fieldName already exists in query string
// 3 - fieldName does not exist in query string
export const updateQueryString = (
    queryString: string | undefined,
    fieldName: string,
    value: string,
) => {
    // 1 - Empty query string returning directly fieldName:value
    if (!queryString) {
        return `${fieldName}:${toQueryValue(value)}`;
    }

    // (field1)(?>:)(\([\S "]+\)|"[\S ]+"|\S+)
    // Todo split up for readability
    const fieldRegex = new RegExp(
        `${fieldName}:(\\([\\S "]+\\)|"[\\S ]+"|\\S+)`,
    );
    const match = queryString.match(fieldRegex);

    if (match) {
        // 2 - Field name already exists in query string as:
        // field:value
        // field:"value with spaces"
        // field:(value1|value2)
        // field:("value1 with spaces"|value2|value3)
        const existingValue = getValueWithoutBrackets(match[1]);
        const updatedValue = `${existingValue}|${toQueryValue(value)}`;

        return queryString.replace(
            fieldRegex,
            `${fieldName}:(${updatedValue})`,
        );
    }

    // 3 - Field name does not exist in query string yet, appending fieldName:value
    return `${queryString} ${fieldName}:${toQueryValue(value)}`;
};
