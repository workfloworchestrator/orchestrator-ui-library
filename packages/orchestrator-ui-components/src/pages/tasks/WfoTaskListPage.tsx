import {
    DEFAULT_PAGE_SIZE,
    FilterQuery,
    getTableConfigFromLocalStorage,
    TableColumnKeys,
    TASK_LIST_TABLE_LOCAL_STORAGE_KEY,
    WfoTableColumns,
} from '../../components';
import { SortOrder } from '../../types';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useDataDisplayParams, useOrchestratorTheme } from '../../hooks';
import { EuiButton, EuiHorizontalRule, EuiSpacer } from '@elastic/eui';
import { WfoPageHeader } from '../../components/WfoPageHeader/WfoPageHeader';
import { WfoRefresh } from '../../icons';
import {
    ProcessListItem,
    WfoProcessList,
} from '../../components/WfoProcessesList/WfoProcessList';
import { WfoStartTaskButtonComboBox } from '../../components';

export const WfoTaskListPage = () => {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('tasks.page');

    const initialPageSize =
        getTableConfigFromLocalStorage(TASK_LIST_TABLE_LOCAL_STORAGE_KEY)
            ?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProcessListItem>({
            pageSize: initialPageSize,
            sortBy: {
                field: 'lastModifiedAt',
                order: SortOrder.DESC,
            },
        });

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
        workflowName: defaultTableColumns.workflowName,      
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

    const defaultHiddenColumns: TableColumnKeys<ProcessListItem> = [
        'assignee',
        'workflowTarget',
        'productName',
        'customer',
        'processId',
    ];

    return (
        <>
            <EuiSpacer />

            <WfoPageHeader pageTitle="Tasks">
                <EuiButton
                    iconType={() => (
                        <WfoRefresh color={theme.colors.primaryText} />
                    )}
                >
                    {t('rerunAll')}
                </EuiButton>
                <WfoStartTaskButtonComboBox />
            </WfoPageHeader>
            <EuiHorizontalRule />

            <EuiSpacer size="xxl" />

            <WfoProcessList
                defaultHiddenColumns={defaultHiddenColumns}
                localStorageKey={TASK_LIST_TABLE_LOCAL_STORAGE_KEY}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                overrideDefaultTableColumns={handleOverrideTableColumns}
                alwaysOnFilters={alwaysOnFilters}
            />
        </>
    );
};
