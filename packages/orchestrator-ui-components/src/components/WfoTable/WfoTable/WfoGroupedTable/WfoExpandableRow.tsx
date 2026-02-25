import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getWfoGroupedTableStyles } from './styles';

export type WfoExpandableRowProps = {
  isExpanded: boolean;
  groupName: string;
  updateExpandedRows: (groupName: string) => void;
  numberOfRowsInGroup: number;
};

export const WfoExpandableRow: FC<WfoExpandableRowProps> = ({
  groupName,
  numberOfRowsInGroup,
  updateExpandedRows,
  isExpanded,
}) => {
  const { expandableRowContainerStyle, expandableRowTextStyle } = useWithOrchestratorTheme(getWfoGroupedTableStyles);
  const t = useTranslations('wfoComponents');

  const hasData = numberOfRowsInGroup > 0;

  return (
    <div css={expandableRowContainerStyle}>
      <EuiButtonIcon
        disabled={!hasData}
        aria-label={isExpanded ? t('collapse') : t('expand')}
        iconType={hasData && isExpanded ? 'arrowDown' : 'arrowRight'}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          updateExpandedRows(groupName);
          event.stopPropagation();
        }}
      />

      <EuiText size="s" css={expandableRowTextStyle}>{`${groupName} (${numberOfRowsInGroup})`}</EuiText>
    </div>
  );
};
