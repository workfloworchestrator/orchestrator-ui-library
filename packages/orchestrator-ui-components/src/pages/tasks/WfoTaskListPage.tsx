import React, { useContext, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiButton, EuiSpacer } from '@elastic/eui';

import {
    ACTIVE_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY,
    DEFAULT_PAGE_SIZE,
    FilterQuery,
    StoredTableConfig,
    WfoFilterTabs,
    WfoStartTaskButtonComboBox,
    WfoTableColumns,
} from '@/components';
import { PATH_TASKS } from '@/components';
import { WfoPageHeader } from '@/components/WfoPageHeader/WfoPageHeader';
import {
    ProcessListItem,
    WfoProcessList,
} from '@/components/WfoProcessList/WfoProcessList';
import { ConfirmationDialogContext } from '@/contexts';
import {
    useCheckEngineStatus,
    useDataDisplayParams,
    useMutateProcess,
    useOrchestratorTheme,
    useStoredTableConfig,
} from '@/hooks';
import { WfoRefresh } from '@/icons';
import { getTaskListTabTypeFromString } from '@/pages/tasks/getTaskListTabTypeFromString';
import { SortOrder } from '@/types';

import { WfoTaskListTabType, defaultTaskListTabs } from './tabConfig';

export const WfoTaskListPage = () => {
    const router = useRouter();
    const t = useTranslations('tasks.page');
    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WfoTaskListTabType.ACTIVE),
    );

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProcessListItem>>();

    const selectedTaskListTab = getTaskListTabTypeFromString(activeTab);

    const localStorageKey =
        selectedTaskListTab === WfoTaskListTabType.ACTIVE
            ? ACTIVE_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY
            : COMPLETED_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY;

    const getStoredTableConfig =
        useStoredTableConfig<ProcessListItem>(localStorageKey);

    const { theme } = useOrchestratorTheme();
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);
    const { retryAllProcesses } = useMutateProcess();
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
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'lastModifiedAt',
                order: SortOrder.DESC,
            },
        });

    const handleChangeTaskListTab = (
        updatedTaskListTab: WfoTaskListTabType,
    ) => {
        setActiveTab(updatedTaskListTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters: FilterQuery<ProcessListItem>[] = [
        {
            // Todo: isTask is not a key of Process
            // However, backend still supports it. Field should not be a keyof ProcessListItem (or process)
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/290
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore waiting for fix in backend
            field: 'isTask',
            value: 'true',
        },
        {
            field: 'lastStatus',
            value: 'running-failed-api_unavailable-inconsistent_data',
        },
    ];

    // Changing the order of the keys, resulting in an updated column order in the table
    const handleOverrideTableColumns: (
        defaultTableColumns: WfoTableColumns<ProcessListItem>,
    ) => WfoTableColumns<ProcessListItem> = (defaultTableColumns) => ({
        workflowName: {
            field: 'workflowName',
            name: t('taskName'),
            render: (value, { processId }) => (
                <Link href={`${PATH_TASKS}/${processId}`}>{value}</Link>
            ),
        },
        lastStep: defaultTableColumns.lastStep,
        lastStatus: defaultTableColumns.lastStatus,
        workflowTarget: defaultTableColumns.workflowTarget,
        productTag: defaultTableColumns.productTag,
        productName: defaultTableColumns.productName,
        customer: defaultTableColumns.customer,
        customerAbbreviation: defaultTableColumns.customerAbbreviation,
        subscriptions: defaultTableColumns.subscriptions,
        createdBy: defaultTableColumns.createdBy,
        assignee: defaultTableColumns.assignee,
        processId: defaultTableColumns.processId,
        startedAt: defaultTableColumns.startedAt,
        lastModifiedAt: defaultTableColumns.lastModifiedAt,
    });

    const handleRerunAllButtonClick = async () => {
        if (await isEngineRunningNow()) {
            showConfirmDialog({
                question: t('rerunAllQuestion'),
                confirmAction: () => {
                    retryAllProcesses.mutate();
                },
            });
        }
    };

    if (!selectedTaskListTab) {
        router.replace(PATH_TASKS);
        return null;
    }

    return (
        <>
            <EuiSpacer />

            <WfoPageHeader pageTitle="Tasks">
                <EuiButton
                    onClick={handleRerunAllButtonClick}
                    iconType={() => (
                        <WfoRefresh color={theme.colors.primaryText} />
                    )}
                >
                    {t('rerunAll')}
                </EuiButton>
                <WfoStartTaskButtonComboBox />
            </WfoPageHeader>
            <WfoFilterTabs
                tabs={defaultTaskListTabs}
                translationNamespace="tasks.tabs"
                selectedTab={selectedTaskListTab}
                onChangeTab={handleChangeTaskListTab}
            />
            <EuiSpacer size="xxl" />

            <WfoProcessList
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                localStorageKey={localStorageKey}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                overrideDefaultTableColumns={handleOverrideTableColumns}
                alwaysOnFilters={alwaysOnFilters}
            />
        </>
    );
};
