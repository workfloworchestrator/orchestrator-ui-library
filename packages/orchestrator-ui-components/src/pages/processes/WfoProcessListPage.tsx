import React, { useState, useEffect } from 'react';

import {
    ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    DEFAULT_PAGE_SIZE,
} from '../../components';
import { SortOrder } from '../../types';

import { useDataDisplayParams, useStoredTableConfig } from '../../hooks';
import type { StoredTableConfig } from '../../components';

import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useRouter } from 'next/router';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { defaultProcessListTabs, WFOProcessListTabType } from './tabConfig';
import { getProcessListTabTypeFromString } from './getProcessListTabTypeFromString';
import { WFOFilterTabs } from '../../components';
import {
    ProcessListItem,
    WFOProcessList,
} from '../../components/WFOProcessesList/WFOProcessList';

export const WFOProcessListPage = () => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WFOProcessListTabType.ACTIVE),
    );

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProcessListItem>>();

    const selectedProcessListTab = getProcessListTabTypeFromString(activeTab);

    const localStorageKey =
        selectedProcessListTab === WFOProcessListTabType.ACTIVE
            ? ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY
            : COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY;

    const getStoredTableConfig =
        useStoredTableConfig<ProcessListItem>(localStorageKey);

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProcessListItem>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'lastModifiedAt',
                order: SortOrder.DESC,
            },
        });

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

            <WFOProcessList
                alwaysOnFilters={alwaysOnFilters}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                localStorageKey={localStorageKey}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
            />
        </>
    );
};
