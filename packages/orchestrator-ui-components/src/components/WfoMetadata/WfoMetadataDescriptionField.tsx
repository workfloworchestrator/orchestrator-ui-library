import React, { FC } from 'react';

import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoMetadataDescriptionFieldProps {
    onSave: (updatedNote: string) => void;
    description: string;
}

export const WfoMetadataDescriptionField: FC<
    WfoMetadataDescriptionFieldProps
> = ({ onSave, description }) => {
    return (
        <div>
            <WfoInlineEdit
                value={description || INVISIBLE_CHARACTER}
                onlyShowOnHover={true}
                onSave={onSave}
            />
        </div>
    );
};
