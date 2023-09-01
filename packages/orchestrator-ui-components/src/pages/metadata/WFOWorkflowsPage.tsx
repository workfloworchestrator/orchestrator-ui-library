import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    WFOProductBlockBadge,
} from '../../components';
import { WFOTableWithFilter } from '../../components';
import {
    getDataSortHandler,
    getPageChangeHandler,
    getEsQueryStringHandler,
} from '../../components';
import type { WFOTableColumns, WFODataSorting } from '../../components';

import type { WorkflowDefinition } from '../../types';
import { SortOrder } from '../../types';
import { StoredTableConfig } from '../../components';

import { useDataDisplayParams, useStoredTableConfig } from '../../hooks';
import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';
import { EuiBadgeGroup } from '@elastic/eui';

const WORKFLOW_FIELD_NAME: keyof WorkflowDefinition = 'name';
const WORKFLOW_FIELD_DESCRIPTION: keyof WorkflowDefinition = 'description';
const WORKFLOW_FIELD_TARGET: keyof WorkflowDefinition = 'target';
const WORKFLOW_FIELD_PRODUCT_TAGS: keyof WorkflowDefinition = 'productTags';
const WORKFLOW_FIELD_CREATED_AT: keyof WorkflowDefinition = 'createdAt';

export const WFOWorkflowsPage = () => {
    //TODO: Delete when backend is implemented - see issue #219

    const isFetching = false;
    const data = {
        workflows: {
            page: [
                {
                    name: 'modify_note',
                    target: 'MODIFY',
                    description: 'Modify Note',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: [
                        'Wireless',
                        'SPNL',
                        'Node',
                        'IPP',
                        'L2VPN',
                        'SP',
                        'LP',
                        'L3VPN',
                        'LR',
                        'MSCNL',
                        'MSC',
                        'IPBGP',
                        'IRBSP',
                        'IPS',
                        'AGGSP',
                        'IPPG',
                        'Corelink',
                        'NSILP',
                        'NSISTPNL',
                        'DCC',
                        'FW',
                        'NSISTP',
                        'IP_PREFIX',
                        'AGGSPNL',
                        'IPPP',
                    ],
                },
                {
                    name: 'task_clean_up_tasks',
                    target: 'SYSTEM',
                    description: 'Clean up old tasks',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: [],
                },
                {
                    name: 'task_resume_workflows',
                    target: 'SYSTEM',
                    description:
                        "Resume all workflows that are stuck on tasks with the status 'waiting'",
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: [],
                },
                {
                    name: 'task_validate_products',
                    target: 'SYSTEM',
                    description: 'Validate products',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: [],
                },
                {
                    name: 'create_core_link',
                    target: 'CREATE',
                    description: 'Create Core Link',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: ['Corelink'],
                },
                {
                    name: 'create_node',
                    target: 'CREATE',
                    description: 'Create Node',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: ['Node'],
                },
                {
                    name: 'create_ip_prefix',
                    target: 'CREATE',
                    description: 'Create IP Prefix',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: ['IP_PREFIX'],
                },
                {
                    name: 'create_sn8_service_port',
                    target: 'CREATE',
                    description: 'Create SN8 Service Port',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: ['SP', 'SPNL'],
                },
                {
                    name: 'modify_sn8_ip_bgp',
                    target: 'MODIFY',
                    description: 'Change a SN8 IP BGP subscription',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: ['IPBGP'],
                },
                {
                    name: 'create_sn8_ip_bgp',
                    target: 'CREATE',
                    description: 'Create SN8 IP BGP',
                    createdAt: '2022-11-30T15:35:36.057665+00:00',
                    productTags: ['IPBGP'],
                },
            ],
            pageInfo: {
                endCursor: 9,
                hasNextPage: true,
                hasPreviousPage: false,
                startCursor: 0,
                totalItems: 10,
            },
        },
    };

    const t = useTranslations('metadata.workflows');

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<WorkflowDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<WorkflowDefinition>(
        METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<WorkflowDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: WORKFLOW_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WFOTableColumns<WorkflowDefinition> = {
        name: {
            field: WORKFLOW_FIELD_NAME,
            name: t('name'),
            width: '200',
        },
        description: {
            field: WORKFLOW_FIELD_DESCRIPTION,
            name: t('description'),
            width: '300',
        },
        target: {
            field: WORKFLOW_FIELD_TARGET,
            name: t('target'),
            width: '90',
        },
        productTags: {
            field: WORKFLOW_FIELD_PRODUCT_TAGS,
            name: t('productTags'),
            render: (productTags) => (
                <>
                    {productTags?.map((productTag, index) => (
                        <WFOProductBlockBadge key={index}>
                            {productTag}
                        </WFOProductBlockBadge>
                    ))}
                </>
            ),
            renderDetails: (productTags) => (
                <EuiBadgeGroup gutterSize="s">
                    {productTags?.map((productTag, index) => (
                        <WFOProductBlockBadge key={index}>
                            {productTag}
                        </WFOProductBlockBadge>
                    ))}
                </EuiBadgeGroup>
            ),
        },
        createdAt: {
            field: WORKFLOW_FIELD_CREATED_AT,
            name: t('createdAt'),
            width: '110',
        },
    };

    //TODO: uncomment when backend is done

    // const { data, isFetching } = useQueryWithGraphql(
    //     GET_WORKFLOWS_GRAPHQL_QUERY,
    //     {
    //         first: dataDisplayParams.pageSize,
    //         after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
    //         sortBy: dataDisplayParams.sortBy,
    //     },
    //     'workflows',
    //     true,
    // );

    const dataSorting: WFODataSorting<WorkflowDefinition> = {
        field: dataDisplayParams.sortBy?.field ?? WORKFLOW_FIELD_NAME,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    const totalItems = data?.workflows.pageInfo.totalItems;

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WFOMetadataPageLayout>
            <WFOTableWithFilter<WorkflowDefinition>
                data={data ? data.workflows.page : []}
                tableColumns={tableColumns}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<WorkflowDefinition>(
                    dataDisplayParams,
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<WorkflowDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateEsQueryString={getEsQueryStringHandler<WorkflowDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                esQueryString={dataDisplayParams.esQueryString}
                localStorageKey={METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY}
            />
        </WFOMetadataPageLayout>
    );
};
