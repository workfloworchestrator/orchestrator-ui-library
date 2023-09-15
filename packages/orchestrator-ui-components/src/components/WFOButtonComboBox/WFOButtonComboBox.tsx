import React, { FC, useState } from 'react';
import { EuiButton, EuiPopover, EuiSelectable } from '@elastic/eui';
import { useRouter } from 'next/router';
import { PATH_NEW_SUBSCRIPTION } from '../WFOPageTemplate';

// GQL Query:
// query CreateWorkflows {
//   workflows(first: 1000, filterBy: {field: "target", value: "CREATE"}) {
//     page {
//       name
//       target
//       description
//       workflowId
//     }
//     pageInfo {
//       startCursor
//       endCursor
//       totalItems
//     }
//   }
// }

export const WFONewSubscriptionButtonComboBox = () => {
    const router = useRouter();

    // Mocked data from backend
    const mockedData = [
        {
            name: 'modify_note',
            target: 'MODIFY',
            description: 'Modify Note',
            workflowId: 'd37a232d-7c1a-4dcc-9712-a40d489500c0',
        },
        {
            name: 'task_clean_up_tasks',
            target: 'SYSTEM',
            description: 'Clean up old tasks',
            workflowId: '00e625f3-7110-45f8-9783-af39e52be29e',
        },
        {
            name: 'task_resume_workflows',
            target: 'SYSTEM',
            description:
                "Resume all workflows that are stuck on tasks with the status 'waiting'",
            workflowId: 'eaa7686f-22ff-4ba2-a7f2-be8d6c70c8f0',
        },
        {
            name: 'task_validate_products',
            target: 'SYSTEM',
            description: 'Validate products',
            workflowId: '1a098c2d-6aee-4267-b038-ddd0a7c7d1b7',
        },
        {
            name: 'create_core_link',
            target: 'CREATE',
            description: 'Create Core Link',
            workflowId: '9d9657f8-786c-4ad3-8d00-f46f63f25923',
        },
    ];

    const options: ComboBoxOption[] = mockedData.map(
        ({ name, description }) => ({
            itemID: name,
            label: description,
        }),
    );

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
