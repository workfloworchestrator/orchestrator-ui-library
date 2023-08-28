import React from 'react';
import {
    ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    DEFAULT_PAGE_SIZE,
    getTableConfigFromLocalStorage,
    WFOFilterTabs,
} from '../../components';
import { Process, SortOrder } from '../../types';
import { useDataDisplayParams } from '../../hooks';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useRouter } from 'next/router';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { defaultProcessListTabs, WFOProcessListTabType } from './tabConfig';
import { getProcessListTabTypeFromString } from './getProcessListTabTypeFromString';
import {
    defaultHiddenColumnsActiveProcesses,
    defaultHiddenColumnsCompletedProcesses,
} from './tableConfig';
import { WFOProcessesList } from '../../components/WFOProcessesList/WFOProcessesList';

export const WFOProcessesListPage = () => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WFOProcessListTabType.ACTIVE),
    );

    const initialPageSize =
        getTableConfigFromLocalStorage(
            ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
        )?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<Process>({
            pageSize: initialPageSize,
            sortBy: {
                // Todo: waiting for fix in backend -- currently the sortBy field id's are not matching with the returned data
                // https://github.com/workfloworchestrator/orchestrator-ui/issues/91
                // @ts-ignore
                field: 'modified',
                // field: 'lastModified',
                order: SortOrder.DESC,
            },
        });

    const selectedProcessListTab = getProcessListTabTypeFromString(activeTab);

    const handleChangeProcessListTab = (
        updatedProcessListTab: WFOProcessListTabType,
    ) => {
        setActiveTab(updatedProcessListTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = defaultProcessListTabs.find(
        ({ id }) => id === selectedProcessListTab,
    )?.alwaysOnFilters;

    if (!selectedProcessListTab) {
        router.replace('/processes');
        return null;
    }

    const defaultHiddenColumns =
        selectedProcessListTab === WFOProcessListTabType.ACTIVE
            ? defaultHiddenColumnsActiveProcesses
            : defaultHiddenColumnsCompletedProcesses;

    const localStorageKey =
        selectedProcessListTab === WFOProcessListTabType.ACTIVE
            ? ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY
            : COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY;

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Processes" />
            <EuiSpacer size="m" />

            <WFOFilterTabs
                tabs={defaultProcessListTabs}
                translationNamespace="processes.tabs"
                selectedTab={selectedProcessListTab}
                onChangeTab={handleChangeProcessListTab}
            />
            <EuiSpacer size="xxl" />

            <WFOProcessesList
                alwaysOnFilters={alwaysOnFilters}
                defaultHiddenColumns={defaultHiddenColumns}
                localStorageKey={localStorageKey}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
            />
        </>
    );
};
