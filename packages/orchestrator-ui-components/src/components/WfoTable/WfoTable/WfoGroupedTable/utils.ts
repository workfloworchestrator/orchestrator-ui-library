import { sortBy, toPairs } from 'lodash';

import { GroupedData } from './WfoGroupedTable';

export const groupData = <T>(
    data: T[],
    groupByFunctions: Array<(data: T) => string>,
): GroupedData<T> => {
    const groupedData = data.reduce<Record<string, T[]>>(
        (groupedData, relatedSubscription) => {
            // In case the array of groupedByFunctions is empty
            const groupName =
                groupByFunctions[0]?.(relatedSubscription) ?? 'Ungrouped';

            return {
                ...groupedData,
                [groupName]: [
                    ...(groupedData[groupName] || []),
                    relatedSubscription,
                ],
            };
        },
        {},
    );

    if (groupByFunctions.length <= 1) {
        return toObjectWithSortedProperties(groupedData);
    }

    const entries = Object.entries(groupedData).map(([key, value]) => {
        return [key, groupData(value, groupByFunctions.slice(1))];
    });
    return toObjectWithSortedProperties(Object.fromEntries(entries));
};

export const toObjectWithSortedProperties = (object: object) => {
    return Object.fromEntries(sortBy(toPairs(object), ([key]) => key));
};

export const getTotalNumberOfRows = <T>(groupedData: GroupedData<T>): number =>
    Object.entries(groupedData).reduce((totalEntries, entry) => {
        const value = entry[1];
        return Array.isArray(value)
            ? totalEntries + value.length
            : totalEntries + getTotalNumberOfRows(value);
    }, 0);
