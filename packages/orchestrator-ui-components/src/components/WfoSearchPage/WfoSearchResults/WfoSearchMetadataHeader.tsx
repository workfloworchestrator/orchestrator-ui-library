import React from 'react';

import { EuiBadge, EuiToolTip } from '@elastic/eui';

interface WfoSearchMetadataHeaderProps {
    search_metadata: {
        search_type: string | null;
        description: string | null;
    };
}

export const WfoSearchMetadataHeader: React.FC<
    WfoSearchMetadataHeaderProps
> = ({ search_metadata }) => {
    if (!search_metadata.search_type) return null;

    return (
        <EuiToolTip content={search_metadata.description || ''}>
            <EuiBadge color="hollow" iconType="search">
                {search_metadata.search_type}
            </EuiBadge>
        </EuiToolTip>
    );
};
