import {
    DEFAULT_PAGE_SIZE,
    FilterQuery,
    getTableConfigFromLocalStorage,
    TableColumnKeys,
    TASK_LIST_TABLE_LOCAL_STORAGE_KEY,
    WFOTableColumns,
} from '../../components';
import { SortOrder } from '../../types';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useDataDisplayParams, useOrchestratorTheme } from '../../hooks';
import { EuiButton, EuiHorizontalRule, EuiSpacer } from '@elastic/eui';
import { WFOPageHeader } from '../../components/WFOPageHeader/WFOPageHeader';
import { WFOPlusCircleFill, WFORefresh } from '../../icons';
import {
    ProcessListItem,
    WFOProcessList,
} from '../../components/WFOProcessesList/WFOProcessList';
import { WFOStartTaskButtonComboBox } from '../../components';

export const WFOTaskListPage = () => {
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
        defaultTableColumns: WFOTableColumns<ProcessListItem>,
    ) => WFOTableColumns<ProcessListItem> = (defaultTableColumns) => ({
        assignee: defaultTableColumns.assignee,
        lastStep: defaultTableColumns.lastStep,
        lastStatus: defaultTableColumns.lastStatus,
        workflowName: defaultTableColumns.workflowName,
        workflowTarget: defaultTableColumns.workflowTarget,
        productTag: defaultTableColumns.productTag,
        productName: defaultTableColumns.productName,
        customer: defaultTableColumns.customer,
        customerAbbreviation: defaultTableColumns.customerAbbreviation,
        subscriptions: defaultTableColumns.subscriptions,
        createdBy: defaultTableColumns.createdBy,
        processId: defaultTableColumns.processId,
        startedAt: defaultTableColumns.startedAt,
        lastModifiedAt: defaultTableColumns.lastModifiedAt,
    });

    const defaultHiddenColumns: TableColumnKeys<ProcessListItem> = [
        'workflowTarget',
        'productName',
        'customer',
        'createdBy',
        'processId',
    ];

    return (
        <>
            <EuiSpacer />

            <WFOPageHeader pageTitle="Tasks">
                <EuiButton
                    iconType={() => (
                        <WFORefresh color={theme.colors.primaryText} />
                    )}
                >
                    {t('rerunAll')}
                </EuiButton>
                <WFOStartTaskButtonComboBox />
            </WFOPageHeader>
            <EuiHorizontalRule />

            <EuiSpacer size="xxl" />

            <WFOProcessList
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
