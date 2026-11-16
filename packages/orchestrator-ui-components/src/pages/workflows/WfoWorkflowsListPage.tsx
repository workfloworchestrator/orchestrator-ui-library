import React from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiSpacer } from '@elastic/eui';

import {
  ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
  COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
  PATH_WORKFLOWS,
} from '@/components';
import { WfoFilterTabs, WfoProcessesList, WfoTitleWithWebsocketBadge } from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';

import { getWorkflowsListTabTypeFromString } from './getWorkflowsListTabTypeFromString';
import { WfoWorkflowsListTabType, defaultWorkflowsListTabs } from './tabConfig';

export const WfoWorkflowsListPage = () => {
  const router = useRouter();
  const t = useTranslations('workflows.index');
  const [activeTab, setActiveTab] = useQueryParam(
    'activeTab',
    withDefault(StringParam, WfoWorkflowsListTabType.ACTIVE),
  );

  const selectedWorkflowsListTab = getWorkflowsListTabTypeFromString(activeTab);

  const localStorageKey =
    selectedWorkflowsListTab === WfoWorkflowsListTabType.ACTIVE ?
      ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY
    : COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY;

  const handleChangeWorkflowsListTab = (updatedWorkflowsListTab: WfoWorkflowsListTabType) => {
    setActiveTab(updatedWorkflowsListTab);
  };

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
        isTask={false}
        statuses={defaultWorkflowsListTabs.find(({ id }) => id === selectedWorkflowsListTab)?.statuses ?? []}
        localStorageKey={localStorageKey}
      />
    </>
  );
};
