import React, { FC } from 'react';

// import { useGetCustomerQuery } from '@/rtk';
import { useUpdateResourceTypeMutation } from '@/rtk/endpoints/resourceTypes';

// import { ResourceTypes, SubscriptionDetail } from '@/types';
import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoResourceTypesDescriptionFieldProps {
    resource_type_id: string;
    description: string;
    onlyShowOnHover?: boolean;
}

export const WfoResourceTypeDescriptionsField: FC<
    WfoResourceTypesDescriptionFieldProps
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
