import React, { useEffect, useState } from 'react';

import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiSpacer,
} from '@elastic/eui';
import {
    DEFAULT_PAGE_SIZE,
    SortOrder,
    StoredTableConfig,
    useDataDisplayParams,
    useStoredTableConfig,
    WfoFilterTabs,
} from '@orchestrator-ui/orchestrator-ui-components';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { defaultServiceTicketsListTabs } from './tabConfig';
import {
    ACTIVE_TICKETS_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_TICKETS_TABLE_LOCAL_STORAGE_KEY,
} from '../../constants-surf';
import {
    ServiceTicketDefinition,
    WfoServiceTicketListTabType,
} from '../../types';
import { WfoServiceTicketsList } from '../WfoServiceTicketsList';
import { getServiceTicketListTabTypeFromString } from '../WfoServiceTicketsList/getServiceTicketListTabTypeFromString';


export const WfoServiceTicketListPage = () => {
    const router = useRouter();
    const t = useTranslations('cim.serviceTickets');

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WfoServiceTicketListTabType.ACTIVE),
    );

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ServiceTicketDefinition>>();

    const selectedServiceTicketListTab =
        getServiceTicketListTabTypeFromString(activeTab);

    const localStorageKey =
        selectedServiceTicketListTab === WfoServiceTicketListTabType.ACTIVE
            ? ACTIVE_TICKETS_TABLE_LOCAL_STORAGE_KEY
            : COMPLETED_TICKETS_TABLE_LOCAL_STORAGE_KEY;

    const getStoredTableConfig =
        useStoredTableConfig<ServiceTicketDefinition>(localStorageKey);

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ServiceTicketDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'last_update_time',
                order: SortOrder.DESC,
            },
        });

    const handleChangeServiceTicketListTab = (
        updatedServiceTicketListTab: WfoServiceTicketListTabType,
    ) => {
        setActiveTab(updatedServiceTicketListTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = defaultServiceTicketsListTabs.find(
        ({ id }) => id === selectedServiceTicketListTab,
    )?.alwaysOnFilters;

    if (!selectedServiceTicketListTab) {
        router.replace('/service-tickets');
        return null;
    }

    return (
        <>
            <EuiSpacer />
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiPageHeader pageTitle={t('serviceTicketPageTitle')} />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButton
                        style={{ paddingInline: '1vw' }}
                        fill
                        iconType="plusInCircleFilled"
                    >
                        {t('newServiceTicket')}
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />

            <WfoFilterTabs
                tabs={defaultServiceTicketsListTabs}
                translationNamespace="cim.serviceTickets.tabs"
                selectedTab={selectedServiceTicketListTab}
                onChangeTab={handleChangeServiceTicketListTab}
            />
            <EuiSpacer size="xxl" />

            <WfoServiceTicketsList
                alwaysOnFilters={alwaysOnFilters}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                localStorageKey={localStorageKey}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
            />
        </>
    );
};
