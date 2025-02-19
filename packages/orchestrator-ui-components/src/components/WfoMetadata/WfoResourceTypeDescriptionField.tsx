import React, { FC } from 'react';

import { useUpdateResourceTypeMutation } from '@/rtk/endpoints/metadata/resourceTypes';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoResourceTypeDescriptionFieldProps {
    resource_type_id: string;
    description: string;
    onlyShowOnHover?: boolean;
}

export const WfoResourceTypeDescriptionField: FC<
    WfoResourceTypeDescriptionFieldProps
> = ({ resource_type_id, description, onlyShowOnHover = true }) => {
    const [updateResourceType, {}] = useUpdateResourceTypeMutation();

    return (
        <div>
            <WfoInlineEdit
                value={description}
                onlyShowOnHover={onlyShowOnHover}
                onSave={(value) =>
                    updateResourceType({
                        resource_type_id: resource_type_id,
                        description: value,
                    })
                }
            />
        </div>
    );
};
