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
  
  if (typeof window !== 'undefined' && window.localStorage) {
    const parsedJson = JSON.parse(localStorage.getItem(key) ?? '{}');
    return isValidLocalStorageTableConfig(parsedJson) ? parsedJson : undefined;
  }
  return undefined
};

export const setTableConfigToLocalStorage = <T>(
    key: string,
    updatedTableConfig: LocalStorageTableConfig<T>,
) => {
  console.log(key, updatedTableConfig)
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, JSON.stringify(updatedTableConfig));
  }  
};

export const clearTableConfigFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(key);
  }  
};
