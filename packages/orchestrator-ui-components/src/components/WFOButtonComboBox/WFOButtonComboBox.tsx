import React, { FC, useState } from 'react';
import { EuiButton, EuiPopover, EuiSelectable } from '@elastic/eui';
import { useRouter } from 'next/router';
import { PATH_NEW_SUBSCRIPTION } from '../WFOPageTemplate';
import { useQueryWithGraphql } from '../../hooks';
import { GET_CREATE_WORKFLOWS_GRAPHQL_QUERY } from '../../graphqlQueries/workflows/createWorkflowsQuery';

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

export type ComboBoxOption = {
    itemID: string;
    label: string;
};

export type WFOButtonComboBoxProps = {
    buttonText: string;
    options: ComboBoxOption[];
    onOptionChange: (selectedOption: ComboBoxOption) => void;
};

export const WFOButtonComboBox: FC<WFOButtonComboBoxProps> = ({
    buttonText,
    options,
    onOptionChange,
}) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);

    const Button = (
        <EuiButton
            onClick={() => setPopoverOpen(!isPopoverOpen)}
            iconType="plus"
            fullWidth
        >
            {buttonText}
        </EuiButton>
    );

    // Todo: initialFocus does not work with multiple searchFields
    return (
        <EuiPopover
            css={{
                inlineSize: '100%',
                div: { inlineSize: '100%' },
            }}
            initialFocus={'.euiFieldSearch'}
            button={Button}
            isOpen={isPopoverOpen}
            closePopover={() => setPopoverOpen(false)}
        >
            <EuiSelectable
                css={{ width: '300px' }}
                searchable
                options={options}
                onChange={(_, __, changedOption) =>
                    onOptionChange(changedOption)
                }
            >
                {(list, search) => (
                    <>
                        {search}
                        {list}
                    </>
                )}
            </EuiSelectable>
        </EuiPopover>
    );
};
