import React, { useState } from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { WFOServiceTicketsPageLayout } from './WFOServiceTicketsPageLayout';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    SortOrder,
    StoredTableConfig,
    useDataDisplayParams,
    useQueryWithRest,
    WFODataSorting,
    WFOTableColumns,
    WFOTableWithFilter,
    WFODateTime,
    parseIsoString,
    parseDateToLocaleDateTimeString,
} from '@orchestrator-ui/orchestrator-ui-components';
import { ServiceTicketDefinition } from '../../types';
import {
    CIM_TICKETS_ENDPOINT,
    METADATA_SERVICE_TICKETS_ACTIVE_TABLE_LOCAL_STORAGE_KEY,
} from '../../constants';
import { Pagination } from '@elastic/eui/src/components';
import { useTranslations } from 'next-intl';

const SERVICE_TICKET_FIELD_JIRA_ID: keyof ServiceTicketDefinition =
    'jira_ticket_id';
const SERVICE_TICKET_FIELD_TITLE: keyof ServiceTicketDefinition = 'title_nl';
const SERVICE_TICKET_FIELD_PROCESS_STATE: keyof ServiceTicketDefinition =
    'process_state';
const SERVICE_TICKET_FIELD_OPENED_BY: keyof ServiceTicketDefinition =
    'opened_by';
const SERVICE_TICKET_FIELD_START_DATE: keyof ServiceTicketDefinition =
    'start_date';
const SERVICE_TICKET_FIELD_CREATE_DATE: keyof ServiceTicketDefinition =
    'create_date';
const SERVICE_TICKET_FIELD_LAST_UPDATE: keyof ServiceTicketDefinition =
    'last_update_time';

export const WFOServiceTicketsActive = () => {
    //Todo: Fix translation showing properly
    const t = useTranslations('cim.serviceTickets');

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ServiceTicketDefinition>>();

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ServiceTicketDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: SERVICE_TICKET_FIELD_PROCESS_STATE,
                order: SortOrder.ASC,
            },
        });

    const { data, isFetching } = useQueryWithRest(
        CIM_TICKETS_ENDPOINT,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy: dataDisplayParams.sortBy,
        },
        'serviceTickets',
    );

    const tableColumns: WFOTableColumns<ServiceTicketDefinition> = {
        jira_ticket_id: {
            field: SERVICE_TICKET_FIELD_JIRA_ID,
            name: t('jiraTicketId'),
            width: '150',
            //Todo: Fix styling and add color according to State
            render: (value) => (
                <EuiFlexGroup>
                    <EuiFlexItem
                        style={{
                            backgroundColor: 'goldenrod',
                            padding: 5,
                            margin: 0,
                        }}
                    />
                    <EuiFlexItem>{value}</EuiFlexItem>
                </EuiFlexGroup>
            ),
        },
        title_nl: {
            field: SERVICE_TICKET_FIELD_TITLE,
            name: t('titleNl'),
            width: '200',
        },
        process_state: {
            field: SERVICE_TICKET_FIELD_PROCESS_STATE,
            name: t('processState'),
            width: '150',
        },
        opened_by: {
            field: SERVICE_TICKET_FIELD_OPENED_BY,
            name: t('openedBy'),
            width: '180',
        },
        start_date: {
            field: SERVICE_TICKET_FIELD_START_DATE,
            name: t('startDate'),
            width: '180',
            render: (date) => <WFODateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
        create_date: {
            field: SERVICE_TICKET_FIELD_CREATE_DATE,
            name: t('createDate'),
            width: '180',
            render: (date: string) => (
                <span>{new Date(date).toLocaleDateString()}</span>
            ),
        },
        last_update_time: {
            field: SERVICE_TICKET_FIELD_LAST_UPDATE,
            name: t('lastUpdateTime'),
            width: '180',
            render: (date: string) => (
                <span>{new Date(date).toLocaleString()}</span>
            ),
        },
    };

    const dataSorting: WFODataSorting<ServiceTicketDefinition> = {
        field: dataDisplayParams.sortBy?.field ?? 'process_state',
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    const totalItems = data?.length;

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WFOServiceTicketsPageLayout>
            <WFOTableWithFilter<ServiceTicketDefinition>
                data={data ? data : []}
                tableColumns={tableColumns}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<ServiceTicketDefinition>(
                    dataDisplayParams,
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<ServiceTicketDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateEsQueryString={getEsQueryStringHandler<ServiceTicketDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                esQueryString={dataDisplayParams.esQueryString}
                localStorageKey={
                    METADATA_SERVICE_TICKETS_ACTIVE_TABLE_LOCAL_STORAGE_KEY
                }
            />
        </WFOServiceTicketsPageLayout>
    );
};
