import React, { useState } from 'react';
import {
    formatDate,
    Comparators,
    EuiBasicTable,
    EuiBasicTableColumn,
    EuiTableSortingType,
    Criteria,
    EuiHealth,
    EuiIcon,
    EuiLink,
    EuiToolTip,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSwitch,
    EuiSpacer,
    EuiCode,
    EuiButton,
} from '@elastic/eui';
import {ServiceTicketDefinition} from "../../types";
import {useTranslations} from "next-intl";
import {
    DEFAULT_PAGE_SIZE, parseDateToLocaleDateTimeString, parseIsoString,
    SortOrder, StoredTableConfig,
    useDataDisplayParams,
    useQueryWithRest, WFOBasicTable, WFODateTime, WFOTableColumns
} from "@orchestrator-ui/orchestrator-ui-components";
import {CIM_TICKETS_ENDPOINT} from "../../constants";
import {WFOServiceTicketsPageLayout} from "./WFOServiceTicketsPageLayout";
import {css} from "@emotion/react";

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
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortField, setSortField] = useState<keyof ServiceTicketDefinition>('jira_ticket_id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        color: {
            field: "color",
            name: "",
            width: '15',
            render: (value) => (
                <EuiFlexItem style={{paddingInline: 5, paddingBlock: 20, backgroundColor: "goldenrod"}} />
            ),
        },
        jira_ticket_id: {
            field: SERVICE_TICKET_FIELD_JIRA_ID,
            name: t('jiraTicketId'),
            width: '100',
            //Todo: Fix styling and add color according to State
            render: (value) => (
                <EuiFlexGroup>
                    <EuiFlexItem>{value}</EuiFlexItem>
                </EuiFlexGroup>
            ),
        },
        title_nl: {
            field: SERVICE_TICKET_FIELD_TITLE,
            name: t('titleNl'),
            width: '250',
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

    const onCriteriaChange = ({ page, sort }: Criteria<ServiceTicketDefinition>) => {
        if (page) {
            const { index: pageIndex, size: pageSize } = page;
            setPageIndex(pageIndex);
            setPageSize(pageSize);
        }
        if (sort) {
            const { field: sortField, direction: sortDirection } = sort;
            setSortField(sortField);
            setSortDirection(sortDirection);
        }
    };

    // Manually handle sorting and pagination of data
    const findServiceTickets = (
        serviceTickets: ServiceTicketDefinition[],
        pageIndex: number,
        pageSize: number,
        sortField: keyof ServiceTicketDefinition,
        sortDirection: 'asc' | 'desc'
    ) => {
        let items;
        if (sortField) {
            items = serviceTickets
                .slice(0)
                .sort(
                    Comparators.property(sortField, Comparators.default(sortDirection))
                );
        } else {
            items = serviceTickets;
        }
        let pageOfItems;
        if (!pageIndex && !pageSize) {
            pageOfItems = items;
        } else {
            const startIndex = pageIndex * pageSize;
            pageOfItems = items.slice(
                startIndex,
                Math.min(startIndex + pageSize, serviceTickets.length)
            );
        }
        return {
            pageOfItems,
            totalItemCount: serviceTickets.length,
        };
    };

    const { pageOfItems, totalItemCount } = findServiceTickets(
        data ? data : [],
        pageIndex,
        pageSize,
        sortField,
        sortDirection
    );
    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: totalItemCount,
        pageSizeOptions: [5, 10, 20],
    };
    const sorting: EuiTableSortingType<ServiceTicketDefinition> = {
        sort: {
            field: sortField,
            direction: sortDirection,
        },
        enableAllColumns: true,
        readOnly: false,
    };
    return (
        <WFOServiceTicketsPageLayout>
            <WFOBasicTable
                data={pageOfItems}
                isLoading={isFetching}
                columns={tableColumns}
                pagination={pagination}
                sorting={sorting}
                onCriteriaChange={onCriteriaChange}
                color={true}
            />
        </WFOServiceTicketsPageLayout>
    );
};
