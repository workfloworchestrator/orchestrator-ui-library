import React from 'react';

import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { GET_WORKFLOWS_FOR_DROPDOWN_LIST_GRAPHQL_QUERY } from '../../../graphqlQueries/workflows/workflowsQueryForDropdownList';
import { useQueryWithGraphql } from '../../../hooks';
import {
    WorkflowComboBoxOption,
    WfoButtonComboBox,
} from '../../WfoButtonComboBox/WfoButtonComboBox';
import { PATH_START_WORKFLOW } from '../paths';


export const WfoStartCreateWorkflowButtonComboBox = () => {
    const router = useRouter();
    const t = useTranslations('common');

    const { data } = useQueryWithGraphql(
        GET_WORKFLOWS_FOR_DROPDOWN_LIST_GRAPHQL_QUERY,
        {
            // Avoiding pagination by fetching an unrealistic amount of items
            first: 1000,
            after: 0,
            filterBy: [{ field: 'target', value: 'CREATE' }],
        },
        'createWorkflows',
    );

    const productList: WorkflowComboBoxOption[] =
        data?.workflows.page
            .flatMap(({ name: workflowName, products }) =>
                products.map(({ productId, name: productName }) => ({
                    label: productName,
                    data: {
                        workflowName,
                        productId,
                    },
                })),
            )
            .sort((a, b) => a.label.localeCompare(b.label)) ?? [];

    const handleOptionChange = (selectedProduct: WorkflowComboBoxOption) => {
        const { workflowName, productId } = selectedProduct.data;
        router.push({
            pathname: `${PATH_START_WORKFLOW}/${workflowName}`,
            query: { productId },
        });
    };

    return (
        <WfoButtonComboBox
            buttonText={t('newSubscription')}
            options={productList}
            onOptionChange={handleOptionChange}
            isProcess
        />
    );
};
