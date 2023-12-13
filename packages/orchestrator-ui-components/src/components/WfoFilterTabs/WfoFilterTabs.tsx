import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiTab, EuiTabs } from '@elastic/eui';

export type FilterQuery<DataType> = {
    field: keyof DataType;
    value: string;
};

export type WfoFilterTab<TabType, DataType = object> = {
    id: TabType;
    translationKey: string;
    alwaysOnFilters?: FilterQuery<DataType>[];
    prepend?: React.ReactNode | string;
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
    return (
        <EuiTabs>
            {tabs.map(({ id, translationKey: name, prepend = '' }) => (
                <EuiTab
                    key={id}
                    isSelected={id === selectedTab}
                    onClick={() => id !== selectedTab && onChangeTab(id)}
                    prepend={prepend}
                >
                    {t(name)}
                </EuiTab>
            ))}
        </EuiTabs>
    );
};
