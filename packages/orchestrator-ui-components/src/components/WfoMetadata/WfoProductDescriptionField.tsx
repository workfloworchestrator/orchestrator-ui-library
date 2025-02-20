import React, { FC } from 'react';

import { useUpdateProductMutation } from '@/rtk/endpoints/metadata/products';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoProductDescriptionFieldProps {
    product_id: string;
    description: string;
    onlyShowOnHover?: boolean;
}

export const WfoProductDescriptionField: FC<
    WfoProductDescriptionFieldProps
> = ({ product_id, description, onlyShowOnHover = true }) => {
    const [updateProduct, {}] = useUpdateProductMutation();

    return (
        <div>
            <WfoInlineEdit
                value={description}
                onlyShowOnHover={onlyShowOnHover}
                onSave={(value) =>
                    updateProduct({
                        product_id: product_id,
                        description: value,
                    })
                }
            />
        </div>
    );
};
