import {
    DEFAULT_PAGE_SIZE,
    FilterQuery,
    getTableConfigFromLocalStorage,
    TableColumnKeys,
    TASK_LIST_TABLE_LOCAL_STORAGE_KEY,
    WFOTableColumns,
} from '../../components';
import { Process, SortOrder } from '../../types';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useDataDisplayParams, useOrchestratorTheme } from '../../hooks';
import { EuiButton, EuiHorizontalRule, EuiSpacer } from '@elastic/eui';
import { WFOPageHeader } from '../../components/WFOPageHeader/WFOPageHeader';
import { WFOPlusCircleFill, WFORefresh } from '../../icons';
import { WFOProcessesList } from '../../components/WFOProcessesList/WFOProcessesList';

export const WFOTaskListPage = () => {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('tasks.page');

    const initialPageSize =
        getTableConfigFromLocalStorage(TASK_LIST_TABLE_LOCAL_STORAGE_KEY)
            ?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

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

    const isTaskFilter: FilterQuery<Process> = {
        // @ts-ignore waiting for fix in backend
        field: 'istask',
        value: 'true',
    };

    // Changing the order of the keys, resulting in an updated column order in the table
    const handleOverrideTableColumns: (
        defaultTableColumns: WFOTableColumns<Process>,
    ) => WFOTableColumns<Process> = (defaultTableColumns) => ({
        assignee: defaultTableColumns.assignee,
        step: defaultTableColumns.step,
        status: defaultTableColumns.status,
        workflowName: defaultTableColumns.workflowName,
        workflowTarget: defaultTableColumns.workflowTarget,
        product: defaultTableColumns.product,
        customer: defaultTableColumns.customer,
        subscriptions: defaultTableColumns.subscriptions,
        createdBy: defaultTableColumns.createdBy,
        processId: defaultTableColumns.processId,
        started: defaultTableColumns.started,
        lastModified: defaultTableColumns.lastModified,
    });

    const defaultHiddenColumns: TableColumnKeys<Process> = [
        'workflowTarget',
        'product',
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
                <EuiButton
                    fill
                    iconType={() => (
                        <WFOPlusCircleFill color={theme.colors.emptyShade} />
                    )}
                >
                    {t('newTask')}
                </EuiButton>
            </WFOPageHeader>
            <EuiHorizontalRule />

            <EuiSpacer size="xxl" />

            <WFOProcessesList
                defaultHiddenColumns={defaultHiddenColumns}
                localStorageKey={TASK_LIST_TABLE_LOCAL_STORAGE_KEY}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                overrideDefaultTableColumns={handleOverrideTableColumns}
                alwaysOnFilters={[isTaskFilter]}
            />
        </>
    );
};
