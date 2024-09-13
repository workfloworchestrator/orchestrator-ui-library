import React, { useContext, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiButton, EuiSpacer } from '@elastic/eui';

import {
    ACTIVE_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY,
    ColumnType,
    DEFAULT_PAGE_SIZE,
    StoredTableConfig,
    WfoFilterTabs,
    WfoIsAllowedToRender,
    WfoStartTaskButtonComboBox,
} from '@/components';
import { PATH_TASKS } from '@/components';
import {
    ProcessListItem,
    WfoProcessesList,
    WfoTitleWithWebsocketBadge,
} from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { toSortedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import {
    useCheckEngineStatus,
    useDataDisplayParams,
    useOrchestratorTheme,
    useStoredTableConfig,
} from '@/hooks';
import { WfoRefresh } from '@/icons';
import { WfoTasksListTabType, defaultTasksListTabs } from '@/pages';
import { getTasksListTabTypeFromString } from '@/pages/tasks/getTasksListTabTypeFromString';
import { useRetryAllProcessesMutation } from '@/rtk/endpoints/processDetail';
import { SortOrder } from '@/types';

export const WfoTasksListPage = () => {
    const router = useRouter();
    const t = useTranslations('tasks.page');
    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WfoTasksListTabType.ACTIVE),
    );

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProcessListItem>>();

    const selectedTasksListTab = getTasksListTabTypeFromString(activeTab);

    const localStorageKey =
        selectedTasksListTab === WfoTasksListTabType.ACTIVE
            ? ACTIVE_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY
            : COMPLETED_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY;

    const getStoredTableConfig =
        useStoredTableConfig<ProcessListItem>(localStorageKey);

    const { theme } = useOrchestratorTheme();
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);
    const [retryAllProcesses] = useRetryAllProcessesMutation();
    const { isEngineRunningNow } = useCheckEngineStatus();

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProcessListItem>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'lastModifiedAt',
                order: SortOrder.DESC,
            },
        });

    const handleChangeTasksListTab = (
        updatedTasksListTab: WfoTasksListTabType,
    ) => {
        setActiveTab(updatedTasksListTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = defaultTasksListTabs.find(
        ({ id }) => id === selectedTasksListTab,
    )?.alwaysOnFilters;

    if (!selectedTasksListTab) {
        router.replace(PATH_TASKS);
        return null;
    }

    const handleRerunAllButtonClick = async () => {
        if (await isEngineRunningNow()) {
            showConfirmDialog({
                question: t('rerunAllQuestion'),
                onConfirm: () => {
                    retryAllProcesses(null);
                },
            });
        }
    };

    // Changing the order of the keys, resulting in an updated column order in the table
    const handleOverrideTableColumns: (
        defaultTableColumns: WfoAdvancedTableColumnConfig<ProcessListItem>,
    ) => WfoAdvancedTableColumnConfig<ProcessListItem> = (
        defaultTableColumns,
    ) => ({
        workflowName: {
            columnType: ColumnType.DATA,
            label: t('taskName'),
            renderData: (value, { processId }) => (
                <Link href={`${PATH_TASKS}/${processId}`}>{value}</Link>
            ),
        },
        ...toSortedTableColumnConfig(defaultTableColumns, [
            'lastStep',
            'lastStatus',
            'workflowTarget',
            'tag',
            'productName',
            'customer',
            'customerAbbreviation',
            'subscriptions',
            'createdBy',
            'assignee',
            'processId',
            'startedAt',
            'lastModifiedAt',
        ]),
    });

    return (
        <>
            <WfoContentHeader
                title={<WfoTitleWithWebsocketBadge title="Tasks" />}
            >
                <WfoIsAllowedToRender resource={PolicyResource.TASKS_RETRY_ALL}>
                    <EuiButton
                        onClick={handleRerunAllButtonClick}
                        iconType={() => (
                            <WfoRefresh color={theme.colors.primaryText} />
                        )}
                    >
                        {t('rerunAll')}
                    </EuiButton>
                </WfoIsAllowedToRender>
                <WfoIsAllowedToRender resource={PolicyResource.TASKS_CREATE}>
                    <WfoStartTaskButtonComboBox />
                </WfoIsAllowedToRender>
            </WfoContentHeader>

            <WfoFilterTabs
                tabs={defaultTasksListTabs}
                translationNamespace="tasks.tabs"
                selectedTab={selectedTasksListTab}
                onChangeTab={handleChangeTasksListTab}
            />
            <EuiSpacer size="xxl" />

            <WfoProcessesList
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                localStorageKey={localStorageKey}
                overrideDefaultTableColumns={handleOverrideTableColumns}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                alwaysOnFilters={alwaysOnFilters}
            />
        </>
    );
};
