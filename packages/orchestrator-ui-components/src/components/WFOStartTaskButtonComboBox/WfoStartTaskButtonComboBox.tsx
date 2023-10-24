import React from 'react';
import { useRouter } from 'next/router';

import { useTranslations } from 'next-intl';
import { useQueryWithGraphql } from '../../hooks';
import { GET_WORKFLOWS_FOR_DROPDOWN_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/workflows/workflowsQueryForDropdownList';
import {
    WorkflowComboBoxOption,
    WFOButtonComboBox,
} from '../WFOButtonComboBox/WFOButtonComboBox';
import { PATH_START_WORKFLOW } from '../WFOPageTemplate';

export const WFOStartTaskButtonComboBox = () => {
    const router = useRouter();
    const t = useTranslations('common');

    const { data } = useQueryWithGraphql(
        GET_WORKFLOWS_FOR_DROPDOWN_LIST_GRAPHQL_QUERY,
        {
            // Avoiding pagination by fetching an unrealistic amount of items
            first: 1000,
            after: 0,
            filterBy: [{ field: 'target', value: 'SYSTEM' }],
        },
        'taskWorkflows',
    );

    const taskList: WorkflowComboBoxOption[] = (data?.workflows.page || [])
        .map(({ name, description }) => ({
            label: description ?? '',
            data: { workflowName: name },
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const handleOptionChange = (selectedProduct: WorkflowComboBoxOption) => {
        const { workflowName } = selectedProduct.data;
        router.push({
            pathname: `${PATH_START_WORKFLOW}/${workflowName}`,
        });
    };

    return (
        <WFOButtonComboBox
            buttonText={t('newTask')}
            options={taskList}
            onOptionChange={handleOptionChange}
            isProcess={false}
        />
    );
};
