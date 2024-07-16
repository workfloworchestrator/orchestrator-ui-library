import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiSwitch } from '@elastic/eui';
import type { Criteria, Pagination } from '@elastic/eui';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    WfoBasicTable,
    WfoDataSorting,
    WfoFirstPartUUID,
    WfoInsyncIcon,
    WfoNoResults,
    WfoSubscriptionStatusBadge,
    WfoTableColumns,
    getDataSortHandler,
    getPageChangeHandler,
} from '@/components';
import { PATH_SUBSCRIPTIONS } from '@/components';
import { useDataDisplayParams, useOrchestratorTheme } from '@/hooks';
import { WfoSearchStrikethrough } from '@/icons';
import { useGetRelatedSubscriptionsQuery } from '@/rtk';
import {
    GraphqlFilter,
    RelatedSubscription,
    SortOrder,
    SubscriptionStatus,
} from '@/types';
import { parseDate, parseDateToLocaleDateString } from '@/utils';

interface WfoRelatedSubscriptionsProps {
    subscriptionId: string;
}

export const WfoRelatedSubscriptions = ({
    subscriptionId,
}: WfoRelatedSubscriptionsProps) => {
    const [hideTerminatedSubscriptions, setHideTerminatedSubscriptions] =
        useState<boolean>(true);
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();

    const terminatedSubscriptionsFilter: GraphqlFilter<RelatedSubscription> = {
        field: 'status',
        value: `${SubscriptionStatus.ACTIVE}-${SubscriptionStatus.DISABLED}-${SubscriptionStatus.INITIAL}-${SubscriptionStatus.MIGRATING}-${SubscriptionStatus.PROVISIONING}`,
    };

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<RelatedSubscription>({
            pageSize: DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'startDate',
                order: SortOrder.DESC,
            },
        });

    const { data, isFetching, isLoading } = useGetRelatedSubscriptionsQuery({
        first: dataDisplayParams.pageSize,
        after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
        subscriptionId: subscriptionId,
        sortBy: dataDisplayParams.sortBy,
        terminatedSubscriptionFilter: hideTerminatedSubscriptions
            ? terminatedSubscriptionsFilter
            : undefined,
    });

    const relatedSubscriptions = data?.relatedSubscriptions;
    const relatedSubscriptionsPageInfo = data?.pageInfo;

    const tableColumns: WfoTableColumns<RelatedSubscription> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: t('id'),
            width: '100',
            render: (value) => <WfoFirstPartUUID UUID={value} />,
            filterable: false,
        },
        description: {
            field: 'description',
            name: t('description'),
            render: (value, record) => (
                <Link
                    target="_blank"
                    href={`${PATH_SUBSCRIPTIONS}/${record.subscriptionId}`}
                >
                    {value}
                </Link>
            ),
            filterable: false,
        },
        status: {
            field: 'status',
            name: t('status'),
            width: '130',
            render: (value) => <WfoSubscriptionStatusBadge status={value} />,
            filterable: false,
        },
        insync: {
            field: 'insync',
            name: t('insync'),
            width: '60',
            render: (value) => <WfoInsyncIcon inSync={value} />,
            filterable: false,
        },
        customer: {
            field: 'customer',
            name: t('customer'),
            render: (customer) => customer.fullname,
            sortable: false,
            filterable: false,
        },
        product: {
            field: 'product',
            name: t('tag'),
            width: '150',
            render: (product) => product.tag,
            filterable: false,
        },
        startDate: {
            field: 'startDate',
            name: t('startDate'),
            width: '100',
            render: (value) => parseDateToLocaleDateString(parseDate(value)),
            filterable: false,
        },
    };

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: relatedSubscriptionsPageInfo?.totalItems ?? 0,
    };

    const dataSorting: WfoDataSorting<RelatedSubscription> = {
        field: dataDisplayParams.sortBy?.field,
        sortOrder: dataDisplayParams.sortBy?.order,
    };

    const onUpdatePage =
        getPageChangeHandler<RelatedSubscription>(setDataDisplayParam);

    const handleCriteriaChange = (criterion: Criteria<RelatedSubscription>) =>
        criterion.page && onUpdatePage(criterion.page);

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
            {(relatedSubscriptions &&
                relatedSubscriptions.length > 0 &&
                (!isFetching ||
                    // This situation represents the situation where the hideRelatedsubscriptions is being toggled
                    // in which case we don't want to show the loadingState because it makes the page flicker
                    (!hideTerminatedSubscriptions &&
                        relatedSubscriptions.length > 0)) && (
                    <>
                        <WfoBasicTable<RelatedSubscription>
                            data={relatedSubscriptions}
                            columns={tableColumns}
                            pagination={pagination}
                            loadingState={{ isLoading, isFetching }}
                            onUpdateDataSorting={getDataSortHandler(
                                setDataDisplayParam,
                            )}
                            dataSorting={dataSorting}
                            onCriteriaChange={handleCriteriaChange}
                        />
                    </>
                )) || (
                <WfoNoResults
                    text={t('noRelatedSubscriptions')}
                    icon={<WfoSearchStrikethrough color={theme.colors.link} />}
                />
            )}
        </>
    );
};
