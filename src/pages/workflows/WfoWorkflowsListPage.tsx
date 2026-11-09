import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiSpacer } from '@elastic/eui';

import {
  ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
  COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
  DEFAULT_PAGE_SIZE,
  PATH_WORKFLOWS,
} from '@/components';
import type { StoredTableConfig } from '@/components';
import { ProcessListItem, WfoFilterTabs, WfoProcessesList, WfoTitleWithWebsocketBadge } from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { useDataDisplayParams, useStoredTableConfig } from '@/hooks';
import { SortOrder } from '@/types';

import { getWorkflowsListTabTypeFromString } from './getWorkflowsListTabTypeFromString';
import { WfoWorkflowsListTabType, defaultWorkflowsListTabs } from './tabConfig';

export const WfoWorkflowsListPage = () => {
  const router = useRouter();
  const t = useTranslations('workflows.index');
  const [activeTab, setActiveTab] = useQueryParam(
    'activeTab',
    withDefault(StringParam, WfoWorkflowsListTabType.ACTIVE),
  );

  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<ProcessListItem>>();

  const selectedWorkflowsListTab = getWorkflowsListTabTypeFromString(activeTab);

  const localStorageKey =
    selectedWorkflowsListTab === WfoWorkflowsListTabType.ACTIVE ?
      ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY
    : COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY;

  const getStoredTableConfig = useStoredTableConfig<ProcessListItem>(localStorageKey);

  useEffect(() => {
    const storedConfig = getStoredTableConfig();

    if (storedConfig) {
      setTableDefaults(storedConfig);
    }
  }, [getStoredTableConfig]);

  const { dataDisplayParams, setDataDisplayParam } = useDataDisplayParams<ProcessListItem>({
    // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
    // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
    pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
    sortBy: {
      field: 'lastModifiedAt',
      order: SortOrder.DESC,
    },
  });

  const handleChangeWorkflowsListTab = (updatedWorkflowsListTab: WfoWorkflowsListTabType) => {
    setActiveTab(updatedWorkflowsListTab);
    setDataDisplayParam('pageIndex', 0);
  };

  const alwaysOnFilters = defaultWorkflowsListTabs.find(({ id }) => id === selectedWorkflowsListTab)?.alwaysOnFilters;

  if (!selectedWorkflowsListTab) {
    router.replace(PATH_WORKFLOWS);
    return null;
  }

  return (
    <>
      <WfoContentHeader title={<WfoTitleWithWebsocketBadge title={t('title')} />} />

      <WfoFilterTabs
        tabs={defaultWorkflowsListTabs}
        translationNamespace="workflows.tabs"
        selectedTab={selectedWorkflowsListTab}
        onChangeTab={handleChangeWorkflowsListTab}
      />
      <EuiSpacer size="xxl" />

      <WfoProcessesList
        alwaysOnFilters={alwaysOnFilters}
        defaultHiddenColumns={tableDefaults?.hiddenColumns}
        localStorageKey={localStorageKey}
        dataDisplayParams={dataDisplayParams}
        setDataDisplayParam={setDataDisplayParam}
      />
    </>
  );
};
