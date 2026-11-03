import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiButton, EuiSpacer } from '@elastic/eui';

import {
  ACTIVE_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY,
  COMPLETED_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY,
  ColumnType,
  WfoFilterTabs,
  WfoIsAllowedToRender,
  WfoStartTaskButtonComboBox,
} from '@/components';
import { PATH_TASKS } from '@/components';
import { ProcessListItem, WfoProcessListActions, WfoProcessesList, WfoTitleWithWebsocketBadge } from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { toSortedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { useCheckEngineStatus, useOrchestratorTheme } from '@/hooks';
import { WfoRefresh } from '@/icons';
import { WfoTasksListTabType, defaultTasksListTabs } from '@/pages';
import { getTasksListTabTypeFromString } from '@/pages/tasks/getTasksListTabTypeFromString';
import { useRetryAllProcessesMutation } from '@/rtk/endpoints/processDetail';

export const WfoTasksListPage = () => {
  const router = useRouter();
  const t = useTranslations('tasks.page');
  const [activeTab, setActiveTab] = useQueryParam('activeTab', withDefault(StringParam, WfoTasksListTabType.ACTIVE));

  const selectedTasksListTab = getTasksListTabTypeFromString(activeTab);

  const localStorageKey =
    selectedTasksListTab === WfoTasksListTabType.ACTIVE ?
      ACTIVE_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY
    : COMPLETED_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY;

  const { theme } = useOrchestratorTheme();
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);
  const [retryAllProcesses] = useRetryAllProcessesMutation();
  const { isEngineRunningNow } = useCheckEngineStatus();

  const handleChangeTasksListTab = (updatedTasksListTab: WfoTasksListTabType) => {
    setActiveTab(updatedTasksListTab);
  };

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
  ) => WfoAdvancedTableColumnConfig<ProcessListItem> = (defaultTableColumns) => ({
    actions: {
      columnType: ColumnType.CONTROL,
      width: '50px',
      renderControl: (row) => <WfoProcessListActions processListItem={row} />,
    },
    ...toSortedTableColumnConfig(defaultTableColumns, ['score']),
    workflowName: {
      columnType: ColumnType.DATA,
      label: t('taskName'),
      renderData: (value, { processId }) => <Link href={`${PATH_TASKS}/${processId}`}>{value}</Link>,
    },
    ...toSortedTableColumnConfig(defaultTableColumns, [
      'lastStep',
      'lastStatus',
      'workflowTarget',
      'product.tag',
      'product.name',
      'customer.fullname',
      'customer.shortcode',
      'note',
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
      <WfoContentHeader title={<WfoTitleWithWebsocketBadge title="Tasks" />}>
        <WfoIsAllowedToRender resource={PolicyResource.TASKS_RETRY_ALL}>
          <EuiButton
            onClick={handleRerunAllButtonClick}
            iconType={() => <WfoRefresh color={theme.colors.textPrimary} />}
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
        localStorageKey={localStorageKey}
        overrideDefaultTableColumns={handleOverrideTableColumns}
        isTask
        statuses={defaultTasksListTabs.find(({ id }) => id === selectedTasksListTab)?.statuses ?? []}
      />
    </>
  );
};
