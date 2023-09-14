import { useCallback, useMemo } from 'react';
import type { StoredTableConfig } from '../components';
import { getTableConfigFromLocalStorage } from '../components';
import { useToastMessage } from './useToastMessage';
import { useTranslations } from 'next-intl';

import { getDefaultTableConfig } from '../utils/getDefaultTableConfig';
import { ToastTypes } from '../contexts';

export const useStoredTableConfig = <T>(localeStorageKey: string) => {
    const toastMessage = useToastMessage();
    const t = useTranslations('errors');
    const tableConfig: StoredTableConfig<T> = useMemo(
        () => getDefaultTableConfig<T>(localeStorageKey),
        [localeStorageKey],
    );

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
                t('retrieve_stored_settings'),
                t('retrieve_stored_settings_title'),
            );
            return tableConfig;
        }
        // Adding toastMessage to the dependency array here will result in an infinite loop in code calling the useStoredTableConfig hook
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localeStorageKey, tableConfig]);

    return getStoredTableConfig;
};
