import React from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { PATH_START_NEW_TASK } from '@/components';
import { GET_WORKFLOWS_FOR_DROPDOWN_LIST_GRAPHQL_QUERY } from '@/graphqlQueries/workflows/workflowsQueryForDropdownList';
import { useCheckEngineStatus, useQueryWithGraphql } from '@/hooks';

import {
    WfoButtonComboBox,
    WorkflowComboBoxOption,
} from '../WfoButtonComboBox/WfoButtonComboBox';

export const WfoStartTaskButtonComboBox = () => {
    const router = useRouter();
    const t = useTranslations('common');
    const { isEngineRunningNow } = useCheckEngineStatus();

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

    const handleOptionChange = async (
        selectedProduct: WorkflowComboBoxOption,
    ) => {
        if (await isEngineRunningNow()) {
            const { workflowName } = selectedProduct.data;
            router.push({
                pathname: `${PATH_START_NEW_TASK}/${workflowName}`,
            });
        }
    };

    return (
        <WfoButtonComboBox
            buttonText={t('newTask')}
            options={taskList}
            onOptionChange={handleOptionChange}
            isProcess={false}
        />
    );
};
