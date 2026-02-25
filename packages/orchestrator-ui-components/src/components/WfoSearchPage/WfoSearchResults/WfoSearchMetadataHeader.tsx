import React, { FC } from 'react';

import { WfoBadge, WfoToolTip } from '@/components';

interface WfoSearchMetadataHeaderProps {
  search_metadata: {
    search_type: string | null;
    description: string | null;
  };
}

export const WfoSearchMetadataHeader: FC<WfoSearchMetadataHeaderProps> = ({ search_metadata }) => {
  if (!search_metadata.search_type) return null;

  return (
    <WfoToolTip tooltipContent={search_metadata.description || ''}>
      <WfoBadge color="hollow" iconType="search" textColor="default">
        {search_metadata.search_type}
      </WfoBadge>
    </WfoToolTip>
  );
};
