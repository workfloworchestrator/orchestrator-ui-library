import { useRouter } from 'next/router';
import { useQueryWithGraphql } from '../../../hooks';
import { GET_WORKFLOWS_FOR_DROPDOWN_LIST_GRAPHQL_QUERY } from '../../../graphqlQueries/workflows/workflowsQueryForDropdownList';
import { PATH_NEW_SUBSCRIPTION } from '../paths';
import React from 'react';
import {
    ComboBoxOption,
    WFOButtonComboBox,
} from '../../WFOButtonComboBox/WFOButtonComboBox';
import { useTranslations } from 'next-intl';

export const WFONewSubscriptionButtonComboBox = () => {
    const router = useRouter();
    const t = useTranslations('common');

    const { data } = useQueryWithGraphql(
        GET_WORKFLOWS_FOR_DROPDOWN_LIST_GRAPHQL_QUERY,
        {
            // Avoiding pagination by fetching an unrealistic amount of items
            first: 1000,
            after: 0,
            // Todo: waiting for backend support
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/276
            // filterBy: [{ field: 'target', value: 'CREATE' }],
        },
        'createWorkflows',
        true,
    );

    const options: ComboBoxOption[] =
        data?.workflows.page.map(({ name, description }) => ({
            itemID: name,
            label: description,
        })) ?? [];

    return (
        <WFOButtonComboBox
            buttonText={t('newSubscription')}
            options={options}
            onOptionChange={(selectedOption) =>
                router.push(`${PATH_NEW_SUBSCRIPTION}/${selectedOption.itemID}`)
            }
        />
    );
};
