import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiPageHeader, EuiSpacer } from '@elastic/eui';

import {
    ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    DEFAULT_PAGE_SIZE,
    PATH_WORKFLOWS,
} from '@/components';
import type { StoredTableConfig } from '@/components';
import { ProcessListItem, WfoFilterTabs, WfoProcessList } from '@/components';
import { useDataDisplayParams, useStoredTableConfig } from '@/hooks';
import { SortOrder } from '@/types';

import { getWorkflowListTabTypeFromString } from './getWorkflowListTabTypeFromString';
import { WfoWorkflowListTabType, defaultWorkflowListTabs } from './tabConfig';

export const WfoWorkflowListPage = () => {
    const router = useRouter();
    const t = useTranslations('workflows.index');
    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WfoWorkflowListTabType.ACTIVE),
    );

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProcessListItem>>();

    const selectedProcessListTab = getWorkflowListTabTypeFromString(activeTab);

    const localStorageKey =
        selectedProcessListTab === WfoWorkflowListTabType.ACTIVE
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
        updatedProcessListTab: WfoWorkflowListTabType,
    ) => {
        setActiveTab(updatedProcessListTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = defaultWorkflowListTabs.find(
        ({ id }) => id === selectedProcessListTab,
    )?.alwaysOnFilters;

    if (!selectedProcessListTab) {
        router.replace(PATH_WORKFLOWS);
        return null;
    }

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle={t('title')} />
            <EuiSpacer size="m" />

            <WfoFilterTabs
                tabs={defaultWorkflowListTabs}
                translationNamespace="workflows.tabs"
                selectedTab={selectedProcessListTab}
                onChangeTab={handleChangeProcessListTab}
            />
            <EuiSpacer size="xxl" />

            <WfoProcessList
                alwaysOnFilters={alwaysOnFilters}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                localStorageKey={localStorageKey}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
            />
        </>
    );
};
