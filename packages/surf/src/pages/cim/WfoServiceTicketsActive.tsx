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
    getSortDirectionFromString,
    parseDateToLocaleDateTimeString,
    parseIsoString,
    SortOrder,
    useOrchestratorTheme,
    useQueryWithRest,
    WFO_TABLE_COLOR_FIELD,
    WfoBasicTable,
    WfoDataSorting,
    WfoDateTime,
    WfoTableColumns,
} from '@orchestrator-ui/orchestrator-ui-components';
import { CIM_TICKETS_ENDPOINT } from '../../constants';
import { WfoServiceTicketsPageLayout } from './WfoServiceTicketsPageLayout';

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

export const WfoServiceTicketsActive = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [dataSorting, setDataSorting] = useState<
        WfoDataSorting<ServiceTicketDefinition>
    >({
        field: SERVICE_TICKET_FIELD_LAST_UPDATE,
        sortOrder: SortOrder.DESC,
    });
    const t = useTranslations('cim.serviceTickets');
    const { data, isFetching } = useQueryWithRest(
        CIM_TICKETS_ENDPOINT,
        'serviceTickets',
    );
    const { theme } = useOrchestratorTheme();

    const mapStateToColor = (state: ServiceTicketProcessState) => {
        switch (state) {
            case OPEN || NEW:
                return theme.colors.success;
            case OPEN_ACCEPTED || OPEN_RELATED:
                return theme.colors.warning;
            case UPDATED:
                return theme.colors.primary;
            case CLOSED || ABORTED:
                return theme.colors.lightShade;
            default:
                return theme.colors.emptyShade;
        }
    };

    const tableColumns: WfoTableColumns<ServiceTicketDefinition> = {
        color: {
            field: WFO_TABLE_COLOR_FIELD,
            name: '',
            width: '1',
            render: (value, object) => (
                <EuiFlexItem
                    style={{
                        paddingInline: 4,
                        paddingBlock: 25,
                        backgroundColor: mapStateToColor(object.process_state),
                    }}
                />
            ),
            sortable: true,
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
        <WfoServiceTicketsPageLayout>
            <WfoBasicTable
                data={pageOfItems}
                isLoading={isFetching}
                columns={tableColumns}
                pagination={pagination}
                sorting={sorting}
                onCriteriaChange={onCriteriaChange}
                dataSorting={dataSorting}
            />
        </WfoServiceTicketsPageLayout>
    );
};
