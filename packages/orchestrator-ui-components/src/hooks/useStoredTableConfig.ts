import { useCallback } from 'react';
import type { StoredTableConfig } from '../components';
import { getTableConfigFromLocalStorage } from '../components';
import { useToastMessage } from './useToast';
import { getDefaultTableConfig } from '../utils/getDefaultTableConfig';
import { ToastTypes } from '../contexts';

export const useStoredTableConfig = <T>(localeStorageKey: string) => {
    const toastMessage = useToastMessage();
    const tableConfig: StoredTableConfig<T> =
        getDefaultTableConfig<T>(localeStorageKey);

    const getStoredTableConfig = useCallback(():
        | StoredTableConfig<T>
        | undefined => {
        try {
            const storedConfig =
                getTableConfigFromLocalStorage(localeStorageKey);
            if (storedConfig) {
                tableConfig.hiddenColumns = storedConfig.hiddenColumns;
                tableConfig.selectedPageSize = storedConfig.selectedPageSize;
            }
            return tableConfig;
        } catch {
            toastMessage.addToast(
                ToastTypes.ERROR,
                'Use tableConfig error text',
                'Use tableConfig error title',
            );
            return tableConfig;
        }
    }, [localeStorageKey, tableConfig, toastMessage]);

    return getStoredTableConfig;
};
