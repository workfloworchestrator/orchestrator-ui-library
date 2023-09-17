import { useRouter } from 'next/router';
import { useQueryWithGraphql } from '../../../hooks';
import { GET_CREATE_WORKFLOWS_GRAPHQL_QUERY } from '../../../graphqlQueries/workflows/createWorkflowsQuery';
import { PATH_NEW_SUBSCRIPTION } from '../paths';
import React from 'react';
import {
    ComboBoxOption,
    WFOButtonComboBox,
} from '../../WFOButtonComboBox/WFOButtonComboBox';

export const WFONewSubscriptionButtonComboBox = () => {
    const router = useRouter();

    const { data } = useQueryWithGraphql(
        GET_CREATE_WORKFLOWS_GRAPHQL_QUERY,
        {
            // Avoiding pagination by fetching an unrealistic amount of items
            first: 1000,
            after: 0,
        },
        'createWorkflows',
        true,
    );

    const options: ComboBoxOption[] =
        data?.workflows.page.map(({ name, description }) => ({
            itemID: name,
            label: description,
        })) ?? [];

    // Todo add translations
    return (
        <WFOButtonComboBox
            buttonText={'New Subscription'}
            options={options}
            onOptionChange={(selectedOption) =>
                router.push(`${PATH_NEW_SUBSCRIPTION}/${selectedOption.itemID}`)
            }
        />
    );
};
