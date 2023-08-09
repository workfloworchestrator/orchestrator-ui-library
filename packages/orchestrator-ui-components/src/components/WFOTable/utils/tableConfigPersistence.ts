import { TableColumnKeys } from './columns';

export type LocalStorageTableConfig<T> = {
    hiddenColumns: TableColumnKeys<T>;
    selectedPageSize: number;
};

export const isValidLocalStorageTableConfig = <T>(
    object: LocalStorageTableConfig<T>,
): object is LocalStorageTableConfig<T> =>
    'hiddenColumns' in object &&
    object.hiddenColumns !== undefined &&
    'selectedPageSize' in object &&
    object.selectedPageSize !== undefined;

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
    try {
        localStorage.setItem(key, JSON.stringify(updatedTableConfig));
    } catch {
        // Todo: implement error handling
        // https://github.com/workfloworchestrator/orchestrator-ui/issues/134
        console.error(
            `An error occurred while updating the default table config for "${key}" in local storage`,
        );
    }
};

export const clearTableConfigFromLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};
