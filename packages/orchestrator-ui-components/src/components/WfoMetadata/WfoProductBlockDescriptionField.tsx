import React, { FC } from 'react';

import { useUpdateProductBlockMutation } from '@/rtk/endpoints/metadata/productBlocks';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoProductBlockDescriptionFieldProps {
    product_block_id: string;
    description: string;
    onlyShowOnHover?: boolean;
}

export const WfoProductBlockDescriptionField: FC<
    WfoProductBlockDescriptionFieldProps
> = ({ product_block_id, description, onlyShowOnHover = true }) => {
    const [updateProductBlock, {}] = useUpdateProductBlockMutation();

    return (
        <div>
            <WfoInlineEdit
                value={description}
                onlyShowOnHover={onlyShowOnHover}
                onSave={(value) =>
                    updateProductBlock({
                        product_block_id: product_block_id,
                        description: value,
                    })
                }
            />
        </div>
    );
};
