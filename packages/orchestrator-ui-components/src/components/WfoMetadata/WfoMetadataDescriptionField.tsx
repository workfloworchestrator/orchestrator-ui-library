import React, { FC } from 'react';

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
                value={description}
                onlyShowOnHover={true}
                onSave={onSave}
            />
        </div>
    );
};
