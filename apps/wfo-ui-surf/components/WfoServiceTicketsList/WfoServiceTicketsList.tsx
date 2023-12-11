import React, { useContext, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Criteria, EuiText } from '@elastic/eui';
import {
    DEFAULT_PAGE_SIZES,
    DataDisplayParams,
    FilterQuery,
    SortOrder,
    TableColumnKeys,
    WfoBasicTable,
    WfoDataSorting,
    WfoTableColumns,
    formatDate,
    getSortDirectionFromString,
    getStyles,
    useFilterQueryWithRest,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { CIM_TICKETS_ENDPOINT } from '@/constants-surf';
import { SurfConfigContext } from '@/contexts/SurfConfigContext';
import { ServiceTicketDefinition, ServiceTicketProcessState } from '@/types';
import { ColorMappings, getColorForState } from '@/utils/getColorForState';

import { WfoServiceTicketStatusBadge } from '../WfoBadges/WfoServiceTicketStatusBadge';

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
    const { getStatusColumnStyle } = getStyles(theme);
    const { cimApiBaseUrl } = useContext(SurfConfigContext);

    const { data, isFetching } =
        useFilterQueryWithRest<ServiceTicketDefinition>(
            cimApiBaseUrl + CIM_TICKETS_ENDPOINT,
            ['serviceTickets'],
            alwaysOnFilters,
        );

    const serviceTicketColorMappings: ColorMappings = {
        [theme.colors.success]: [OPEN, NEW],
        [theme.colors.warning]: [OPEN_ACCEPTED, OPEN_RELATED],
        [theme.colors.primary]: [UPDATED],
        [theme.colors.lightShade]: [CLOSED, ABORTED],
    };

    const tableColumns: WfoTableColumns<ServiceTicketDefinition> = {
        _id: {
            field: '_id',
            name: '_id',
            width: '0',
        },
        jira_ticket_id: {
            field: SERVICE_TICKET_FIELD_JIRA_ID,
            name: t('jiraTicketId'),
            width: '100',
            render: (value, object) => (
                <Link href={`/service-tickets/${object._id}`}>{value}</Link>
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
            render: (date, object) => {
                return object.create_date > date ? (
                    <EuiText color={theme.colors.dangerText} size={'s'}>
                        <b>{formatDate(date)}</b>
                    </EuiText>
                ) : (
                    <EuiText size={'s'}>{formatDate(date)}</EuiText>
                );
            },
        },
        create_date: {
            field: SERVICE_TICKET_FIELD_CREATE_DATE,
            name: t('createDate'),
            width: '150',
            render: formatDate,
        },
        last_update_time: {
            field: SERVICE_TICKET_FIELD_LAST_UPDATE,
            name: t('lastUpdateTime'),
            width: '150',
            render: formatDate,
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

    const paginateServiceTickets = (
        serviceTickets: ServiceTicketDefinition[],
        pageIndex: number,
        pageSize: number,
    ) => {
        let pageOfItems;
        if (!pageIndex && !pageSize) {
            pageOfItems = serviceTickets;
        } else {
            const startIndex = pageIndex * pageSize;
            pageOfItems = serviceTickets.slice(
                startIndex,
                Math.min(startIndex + pageSize, serviceTickets.length),
            );
        }
        return {
            pageOfItems,
            totalItemCount: serviceTickets.length,
        };
    };

    const sortedData = data?.sort(
        (a: ServiceTicketDefinition, b: ServiceTicketDefinition) => {
            const aValue = a[dataSorting.field];
            const bValue = b[dataSorting.field];
            if (aValue === bValue) {
                return 0;
            }
            if (aValue === null || aValue === undefined) {
                return 1;
            }
            if (bValue === null || bValue === undefined) {
                return -1;
            }
            return aValue > bValue
                ? dataSorting.sortOrder === SortOrder.ASC
                    ? 1
                    : -1
                : dataSorting.sortOrder === SortOrder.ASC
                  ? -1
                  : 1;
        },
    );

    const { pageOfItems, totalItemCount } = paginateServiceTickets(
        sortedData ? sortedData : [],
        pageIndex,
        pageSize,
    );

    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: totalItemCount,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
    };

    return (
        <WfoBasicTable
            data={pageOfItems ? pageOfItems : []}
            isLoading={isFetching}
            columns={tableColumns}
            pagination={pagination}
            onCriteriaChange={onCriteriaChange}
            dataSorting={dataSorting}
            getStatusColorForRow={(row) =>
                getColorForState(serviceTicketColorMappings, row.process_state)
            }
            onUpdateDataSorting={(currentSort) => {
                setDataSorting(currentSort);
            }}
            customTableStyle={getStatusColumnStyle(1)}
        />
    );
};
