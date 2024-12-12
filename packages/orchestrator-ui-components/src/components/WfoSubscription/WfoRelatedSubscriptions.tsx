import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiSwitch } from '@elastic/eui';

import {
    DEFAULT_PAGE_SIZES,
    SubscriptionListItem,
    WfoDataSorting,
    WfoFirstPartUUID,
    WfoInsyncIcon,
    WfoNoResults,
    WfoSubscriptionStatusBadge,
    getDataSortHandler,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import { PATH_SUBSCRIPTIONS } from '@/components';
import {
    graphQlRelatedSubscriptionsSortMapper,
    graphQlRelatedSubscriptionsTerminatedSubscriptionsFilterMapper,
    mapRelatedSubscriptionsResponseToRelatedSubscriptionsListItems,
} from '@/components/WfoSubscription/utils/relatedSubscriptionsListItemsObjectMappers';
import {
    ColumnType,
    Pagination,
    WfoTable,
    WfoTableColumnConfig,
} from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { useDataDisplayParams, useOrchestratorTheme } from '@/hooks';
import { WfoSearchStrikethrough } from '@/icons';
import {
    RelatedSubscriptionVariables,
    useGetRelatedSubscriptionsQuery,
} from '@/rtk';
import { GraphqlFilter, SortOrder, SubscriptionStatus } from '@/types';
import { parseDateToLocaleDateString } from '@/utils';

export type RelatedSubscriptionListItem = Pick<
    SubscriptionListItem,
    | 'subscriptionId'
    | 'description'
    | 'status'
    | 'insync'
    | 'customerFullname'
    | 'tag'
    | 'startDate'
>;

interface WfoRelatedSubscriptionsProps {
    subscriptionId: string;
    subscriptionPath?: string;
}

export const WfoRelatedSubscriptions = ({
    subscriptionId,
    subscriptionPath = PATH_SUBSCRIPTIONS,
}: WfoRelatedSubscriptionsProps) => {
    const [hideTerminatedSubscriptions, setHideTerminatedSubscriptions] =
        useState<boolean>(true);
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();

    const terminatedSubscriptionsFilter: GraphqlFilter<RelatedSubscriptionListItem> =
        {
            field: 'status',
            value: `${SubscriptionStatus.ACTIVE}-${SubscriptionStatus.DISABLED}-${SubscriptionStatus.INITIAL}-${SubscriptionStatus.MIGRATING}-${SubscriptionStatus.PROVISIONING}`,
        };

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<RelatedSubscriptionListItem>({
            sortBy: {
                field: 'startDate',
                order: SortOrder.DESC,
            },
        });

    const graphqlQueryVariables: RelatedSubscriptionVariables = {
        first: dataDisplayParams.pageSize,
        after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
        subscriptionId: subscriptionId,
        sortBy: graphQlRelatedSubscriptionsSortMapper(dataDisplayParams.sortBy),
        terminatedSubscriptionFilter: hideTerminatedSubscriptions
            ? graphQlRelatedSubscriptionsTerminatedSubscriptionsFilterMapper(
                  terminatedSubscriptionsFilter,
              )
            : undefined,
    };

    const { data, isFetching, isLoading } = useGetRelatedSubscriptionsQuery(
        graphqlQueryVariables,
    );

    const relatedSubscriptions =
        mapRelatedSubscriptionsResponseToRelatedSubscriptionsListItems(data);
    const relatedSubscriptionsPageInfo = data?.pageInfo;

    const tableColumns: WfoTableColumnConfig<RelatedSubscriptionListItem> = {
        subscriptionId: {
            columnType: ColumnType.DATA,
            label: t('id'),
            renderData: (value) => <WfoFirstPartUUID UUID={value} />,
            renderTooltip: (value) => value,
        },
        description: {
            columnType: ColumnType.DATA,
            label: t('description'),
            renderData: (value, record) => (
                <Link
                    target="_blank"
                    href={`${subscriptionPath}/${record.subscriptionId}`}
                >
                    {value}
                </Link>
            ),
        },
        status: {
            columnType: ColumnType.DATA,
            label: t('status'),
            renderData: (value) => (
                <WfoSubscriptionStatusBadge status={value} />
            ),
        },
        insync: {
            columnType: ColumnType.DATA,
            label: t('insync'),
            renderData: (value) => <WfoInsyncIcon inSync={value} />,
        },
        customerFullname: {
            columnType: ColumnType.DATA,
            label: t('customer'),
            renderTooltip: (value) => value,
        },
        tag: {
            columnType: ColumnType.DATA,
            label: t('tag'),
            width: '150px',
        },
        startDate: {
            columnType: ColumnType.DATA,
            label: t('startDate'),
            renderData: parseDateToLocaleDateString,
            renderTooltip: parseDateToLocaleDateString,
        },
    };

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        totalItemCount: relatedSubscriptionsPageInfo?.totalItems ?? 0,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        onChangeItemsPerPage: getPageSizeChangeHandler(setDataDisplayParam),
        onChangePage: getPageIndexChangeHandler(setDataDisplayParam),
    };

    const dataSorting: WfoDataSorting<RelatedSubscriptionListItem> = {
        field: dataDisplayParams.sortBy?.field,
        sortOrder: dataDisplayParams.sortBy?.order,
    };

    const toggleTerminatedSubscriptions = () => {
        setHideTerminatedSubscriptions((currentValue) => !currentValue);
    };
    return (
        <>
            <EuiSpacer size="xl" />
            <EuiFlexGroup justifyContent="flexEnd">
                <EuiFlexItem grow={0}>
                    <EuiSwitch
                        showLabel={true}
                        label={t('hideTerminatedRelatedSubscriptions')}
                        type="button"
                        checked={hideTerminatedSubscriptions}
                        onChange={toggleTerminatedSubscriptions}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            {(relatedSubscriptions?.length > 0 &&
                (!isLoading ||
                    // This situation represents the situation where the hideRelatedsubscriptions is being toggled
                    // in which case we don't want to show the loadingState because it makes the page flicker
                    (!hideTerminatedSubscriptions &&
                        relatedSubscriptions.length > 0)) && (
                    <WfoTable
                        data={relatedSubscriptions}
                        columnConfig={mapSortableAndFilterableValuesToTableColumnConfig<RelatedSubscriptionListItem>(
                            tableColumns,
                            data?.pageInfo.sortFields ?? [],
                        )}
                        pagination={pagination}
                        isLoading={isFetching}
                        onUpdateDataSorting={getDataSortHandler(
                            setDataDisplayParam,
                        )}
                        dataSorting={[dataSorting]}
                    />
                )) || (
                <WfoNoResults
                    text={t('noRelatedSubscriptions')}
                    icon={<WfoSearchStrikethrough color={theme.colors.link} />}
                />
            )}
        </>
    );
};
