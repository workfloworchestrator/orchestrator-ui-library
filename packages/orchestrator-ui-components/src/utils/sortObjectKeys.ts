import { getTypedFieldFromObject } from './getTypedFieldFromObject';

// Some components in this project need the keys of an object to be in a certain order
// This function sorts the keys of an object based on an array of strings
// Keys that do not exist in the object will be ignored
export const sortObjectKeys = <T extends object>(
    object: T,
    keyOrder: string[],
): T => {
    const sortedObject: Partial<T> = {};

    keyOrder.forEach((key) => {
        const keyOfT = getTypedFieldFromObject(key, object);
        if (keyOfT !== null) {
            sortedObject[keyOfT] = object[keyOfT];
        }
    });

    return sortedObject as T;
};
