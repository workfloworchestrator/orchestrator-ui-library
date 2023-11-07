import React, { useState } from 'react';
import {
    Comparators,
    Criteria,
    EuiFlexGroup,
    EuiFlexItem,
    EuiTableSortingType,
} from '@elastic/eui';
import {
    ServiceTicketDefinition,
    ServiceTicketProcessState,
} from '../../types';
import { useTranslations } from 'next-intl';
import {
    DataDisplayParams,
    FilterQuery,
    getSortDirectionFromString,
    parseDateToLocaleDateTimeString,
    parseIsoString,
    SortOrder,
    TableColumnKeys,
    useFilterQueryWithRest,
    useOrchestratorTheme,
    WfoBasicTable,
    WfoDataSorting,
    WfoDateTime,
    WfoTableColumns,
} from '@orchestrator-ui/orchestrator-ui-components';
import { CIM_TICKETS_ENDPOINT } from '../../constants-surf';
import { WfoServiceTicketStatusBadge } from '../WfoBadges/WfoServiceTicketStatusBadge';
import { ColorMappings, getColorForState } from '../../utils/getColorForState';

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

const { NEW, OPEN, OPEN_RELATED, OPEN_ACCEPTED, UPDATED, ABORTED, CLOSED } =
    ServiceTicketProcessState;

export type WfoServiceTicketsListProps = {
    alwaysOnFilters?: FilterQuery<ServiceTicketDefinition>[];
    defaultHiddenColumns: TableColumnKeys<ServiceTicketDefinition> | undefined;
    localStorageKey: string;
    dataDisplayParams: DataDisplayParams<ServiceTicketDefinition>;
    setDataDisplayParam: <
        DisplayParamKey extends
            keyof DataDisplayParams<ServiceTicketDefinition>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<ServiceTicketDefinition>[DisplayParamKey],
    ) => void;
    overrideDefaultTableColumns?: (
        defaultTableColumns: WfoTableColumns<ServiceTicketDefinition>,
    ) => WfoTableColumns<ServiceTicketDefinition>;
};

export const WfoServiceTicketsList = ({
    alwaysOnFilters,
}: WfoServiceTicketsListProps) => {
    const { theme } = useOrchestratorTheme();
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [dataSorting, setDataSorting] = useState<
        WfoDataSorting<ServiceTicketDefinition>
    >({
        field: SERVICE_TICKET_FIELD_LAST_UPDATE,
        sortOrder: SortOrder.DESC,
    });

    const t = useTranslations('cim.serviceTickets');
    const { data, isFetching } = useFilterQueryWithRest(
        CIM_TICKETS_ENDPOINT,
        'serviceTickets',
        alwaysOnFilters,
    );

    const serviceTicketColorMappings: ColorMappings = {
        [theme.colors.success]: [OPEN, NEW],
        [theme.colors.warning]: [OPEN_ACCEPTED, OPEN_RELATED],
        [theme.colors.primary]: [UPDATED],
        [theme.colors.lightShade]: [CLOSED, ABORTED],
    };

    const tableColumns: WfoTableColumns<ServiceTicketDefinition> = {
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
            sortable: true,
        },
        title_nl: {
            field: SERVICE_TICKET_FIELD_TITLE,
            name: t('titleNl'),
            width: '300',
        },
        process_state: {
            field: SERVICE_TICKET_FIELD_PROCESS_STATE,
            name: t('processState'),
            width: '120',
            render: (value, object) => (
                <WfoServiceTicketStatusBadge
                    serviceTicketState={object.process_state}
                />
            ),
        },
        opened_by: {
            field: SERVICE_TICKET_FIELD_OPENED_BY,
            name: t('openedBy'),
            width: '180',
        },
        start_date: {
            field: SERVICE_TICKET_FIELD_START_DATE,
            name: t('startDate'),
            width: '150',
            render: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
        create_date: {
            field: SERVICE_TICKET_FIELD_CREATE_DATE,
            name: t('createDate'),
            width: '150',
            render: (date: string) => (
                <span>{new Date(date).toLocaleDateString()}</span>
            ),
        },
        last_update_time: {
            field: SERVICE_TICKET_FIELD_LAST_UPDATE,
            name: t('lastUpdateTime'),
            width: '150',
            render: (date: string) => (
                <span>{new Date(date).toLocaleString()}</span>
            ),
        },
    };

    const onCriteriaChange = ({
        page,
        sort,
    }: Criteria<ServiceTicketDefinition>) => {
        if (page) {
            const { index: pageIndex, size: pageSize } = page;
            setPageIndex(pageIndex);
            setPageSize(pageSize);
        }
        if (sort) {
            const { field: sortField, direction: sortDirection } = sort;
            const sortOrder = getSortDirectionFromString(
                sortDirection,
            ) as SortOrder;
            setDataSorting({
                field: sortField,
                sortOrder: sortOrder,
            });
        }
    };

    // Manually handle sorting and pagination of data
    const findServiceTickets = (
        serviceTickets: ServiceTicketDefinition[],
        pageIndex: number,
        pageSize: number,
        sortField: keyof ServiceTicketDefinition,
        sortDirection: 'asc' | 'desc',
    ) => {
        let items;
        if (sortField) {
            items = serviceTickets
                .slice(0)
                .sort(
                    Comparators.property(
                        sortField,
                        Comparators.default(sortDirection),
                    ),
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
                Math.min(startIndex + pageSize, serviceTickets.length),
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
        dataSorting.field,
        dataSorting.sortOrder.toLowerCase() as 'asc' | 'desc',
    );
    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: totalItemCount,
        pageSizeOptions: [5, 10, 20],
    };
    const sorting: EuiTableSortingType<ServiceTicketDefinition> = {
        sort: {
            field: dataSorting.field,
            direction: dataSorting.sortOrder.toLowerCase() as 'asc' | 'desc',
        },
        enableAllColumns: true,
        readOnly: false,
    };

    return (
        <WfoBasicTable
            data={pageOfItems}
            isLoading={isFetching}
            columns={tableColumns}
            pagination={pagination}
            sorting={sorting}
            onCriteriaChange={onCriteriaChange}
            dataSorting={dataSorting}
            getStatusColorForRow={(row) =>
                getColorForState(serviceTicketColorMappings, row.process_state)
            }
        />
    );
};
