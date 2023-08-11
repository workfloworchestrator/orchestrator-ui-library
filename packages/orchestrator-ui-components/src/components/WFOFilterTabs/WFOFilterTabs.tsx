import React from 'react';
import { EuiTab, EuiTabs } from '@elastic/eui';
import { useTranslations } from 'next-intl';

export type FilterQuery<DataType> = {
    field: keyof DataType;
    value: string;
};

export type WFOFilterTab<TabType, DataType> = {
    id: TabType;
    translationKey: string;
    alwaysOnFilters?: FilterQuery<DataType>[];
};

export type WFOFilterTabsProps<TabType, DataType> = {
    tabs: WFOFilterTab<TabType, DataType>[];
    selectedSubscriptionsTab: TabType;
    translationNamespace: string;
    onChangeSubscriptionsTab: (updatedSubscriptionsTab: TabType) => void;
};

export const WFOFilterTabs = <TabType extends string, DataType>({
    tabs,
    selectedSubscriptionsTab,
    translationNamespace,
    onChangeSubscriptionsTab,
}: WFOFilterTabsProps<TabType, DataType>) => {
    const t = useTranslations(translationNamespace);
    return (
        <EuiTabs>
            {tabs.map(({ id, translationKey: name }) => (
                <EuiTab
                    key={id}
                    isSelected={id === selectedSubscriptionsTab}
                    onClick={() =>
                        id !== selectedSubscriptionsTab &&
                        onChangeSubscriptionsTab(id)
                    }
                >
                    {t(name)}
                </EuiTab>
            ))}
        </EuiTabs>
    );
};
