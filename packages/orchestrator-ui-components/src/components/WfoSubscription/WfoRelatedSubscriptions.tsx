import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiSwitch } from '@elastic/eui';
import type { Criteria, Pagination } from '@elastic/eui';

import { GET_RELATED_SUBSCRIPTIONS_GRAPHQL_QUERY } from '../../graphqlQueries/relatedSubscriptionsQuery';
import {
    useDataDisplayParams,
    useOrchestratorTheme,
    useQueryWithGraphql,
} from '../../hooks';
import { WfoSearchStrikethrough } from '../../icons';
import {
    GraphqlFilter,
    RelatedSubscription,
    SortOrder,
    SubscriptionStatus,
} from '../../types';
import { parseDate, parseDateToLocaleDateString } from '../../utils';
import { WfoSubscriptionStatusBadge } from '../WfoBadges';
import { WfoInsyncIcon } from '../WfoInsyncIcon/WfoInsyncIcon';
import { WfoNoResults } from '../WfoNoResults';
import {
    WfoTableColumns,
    getDataSortHandler,
    getPageChangeHandler,
} from '../WfoTable';
import { WfoBasicTable, WfoDataSorting } from '../WfoTable';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZES } from '../WfoTable';
import { WfoFirstPartUUID } from '../WfoTable/WfoFirstPartUUID';

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

    const { data, isFetching } = useQueryWithGraphql(
        GET_RELATED_SUBSCRIPTIONS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            subscriptionId: subscriptionId,
            sortBy: dataDisplayParams.sortBy,
            terminatedSubscriptionFilter: hideTerminatedSubscriptions
                ? terminatedSubscriptionsFilter
                : undefined,
        },
        'relatedSubscriptions',
    );
    const relatedSubscriptions =
        data?.subscriptions.page[0].inUseBySubscriptions.page;
    const relatedSubscriptionsPageInfo =
        data?.subscriptions.page[0].inUseBySubscriptions.pageInfo;
    const tableColumns: WfoTableColumns<RelatedSubscription> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: t('id'),
            width: '100',
            render: (value) => <WfoFirstPartUUID UUID={value} />,
        },
        description: {
            field: 'description',
            name: t('description'),
            render: (value, record) => (
                <Link
                    target="_blank"
                    href={`/subscriptions/${record.subscriptionId}`}
                >
                    {value}
                </Link>
            ),
        },
        status: {
            field: 'status',
            name: t('status'),
            width: '130',
            render: (value) => <WfoSubscriptionStatusBadge status={value} />,
        },
        insync: {
            field: 'insync',
            name: t('insync'),
            width: '60',
            render: (value) => <WfoInsyncIcon inSync={value} />,
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
        },
        startDate: {
            field: 'startDate',
            name: t('startDate'),
            width: '100',
            render: (value) => parseDateToLocaleDateString(parseDate(value)),
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
                            isLoading={isFetching}
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
