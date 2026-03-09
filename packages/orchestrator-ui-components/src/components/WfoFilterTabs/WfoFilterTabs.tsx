import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiTab, EuiTabs } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export type FilterQuery<DataType> = {
  field: keyof DataType;
  value: string;
};

export type WfoFilterTab<TabType, DataType = object> = {
  id: TabType;
  translationKey: string;
  alwaysOnFilters?: FilterQuery<DataType>[];
  prepend?: React.ReactNode | string;
  append?: React.ReactNode | string;
};

export type WfoFilterTabsProps<TabType, DataType> = {
  tabs: WfoFilterTab<TabType, DataType>[];
  selectedTab: TabType;
  translationNamespace: string;
  onChangeTab: (updatedTab: TabType) => void;
};

export const WfoFilterTabs = <TabType extends string, DataType>({
  tabs,
  selectedTab,
  translationNamespace,
  onChangeTab,
}: WfoFilterTabsProps<TabType, DataType>) => {
  const t = useTranslations(translationNamespace);
  const { tabStyle } = useWithOrchestratorTheme(getStyles);
  return (
    <EuiTabs>
      {tabs.map(({ id, translationKey: name, prepend = '', append = '' }) => (
        <EuiTab
          css={tabStyle}
          key={id}
          isSelected={id === selectedTab}
          onClick={() => id !== selectedTab && onChangeTab(id)}
          prepend={prepend}
          append={append}
        >
          {t(name)}
        </EuiTab>
      ))}
    </EuiTabs>
  );
};
