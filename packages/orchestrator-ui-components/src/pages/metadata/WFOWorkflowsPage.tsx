import React from 'react';
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
    getTableConfigFromLocalStorage,
    getDataSortHandler,
    getPageChangeHandler,
    getEsQueryStringHandler,
} from '../../components';
import type { WFOTableColumns, WFODataSorting } from '../../components';

import type { WorkflowDefinition } from '../../types';
import { SortOrder } from '../../types';

import { useDataDisplayParams } from '../../hooks';
import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';

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

    const initialPageSize =
        getTableConfigFromLocalStorage(
            METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
        )?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<WorkflowDefinition>({
            pageSize: initialPageSize,
            sortBy: {
                field: WORKFLOW_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WFOTableColumns<WorkflowDefinition> = {
        name: {
            field: WORKFLOW_FIELD_NAME,
            name: t('name'),
            width: '110',
        },
        description: {
            field: WORKFLOW_FIELD_DESCRIPTION,
            name: t('description'),
            width: '220',
        },
        target: {
            field: WORKFLOW_FIELD_TARGET,
            name: t('target'),
            width: '50',
        },
        productTags: {
            field: WORKFLOW_FIELD_PRODUCT_TAGS,
            name: t('productTags'),
            width: '200',
            render: (productTags) => (
                <>
                    {productTags &&
                        productTags.map((productTag, index) => (
                            <WFOProductBlockBadge key={index}>
                                {productTag}
                            </WFOProductBlockBadge>
                        ))}
                </>
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
