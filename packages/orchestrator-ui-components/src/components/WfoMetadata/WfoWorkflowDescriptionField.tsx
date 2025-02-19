import React, { FC } from 'react';

import { useUpdateWorkflowMutation } from '@/rtk/endpoints/metadata/workflows';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoWorkflowDescriptionFieldProps {
    workflow_id: string;
    description: string;
    onlyShowOnHover?: boolean;
}

export const WfoWorkflowDescriptionField: FC<
    WfoWorkflowDescriptionFieldProps
> = ({ workflow_id, description, onlyShowOnHover = true }) => {
    const [updateWorkflowType, {}] = useUpdateWorkflowMutation();

    return (
        <div>
            <WfoInlineEdit
                value={description}
                onlyShowOnHover={onlyShowOnHover}
                onSave={(value) =>
                    updateWorkflowType({
                        workflow_id: workflow_id,
                        description: value,
                    })
                }
            />
        </div>
    );
};
