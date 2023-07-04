import { TableColumnKeys } from './columns';

export type LocalStorageTableConfig<T> = {
    hiddenColumns: TableColumnKeys<T>;
    selectedPageSize: number;
};

export const isValidLocalStorageTableConfig = <T>(
    object: LocalStorageTableConfig<T>,
): object is LocalStorageTableConfig<T> => {
    return (
        'hiddenColumns' in object &&
        object.hiddenColumns !== undefined &&
        'selectedPageSize' in object &&
        object.selectedPageSize !== undefined
    );
};

export const getTableConfigFromLocalStorage = <T>(
    key: string,
): LocalStorageTableConfig<T> | undefined => {
    try {
        const parsedJson = JSON.parse(localStorage.getItem(key) ?? '{}');
        return isValidLocalStorageTableConfig(parsedJson)
            ? parsedJson
            : undefined;
    } catch (e) {
        return undefined;
    }
};

export const setTableConfigToLocalStorage = <T>(
    key: string,
    updatedTableConfig: LocalStorageTableConfig<T>,
) => {
    localStorage.setItem(key, JSON.stringify(updatedTableConfig));
};

export const clearTableConfigFromLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};
