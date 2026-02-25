import React, { FC } from 'react';

import { EuiAvatar, EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiPanel, EuiText } from '@elastic/eui';
import { IconType } from '@elastic/eui/src/components/icon';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';

import { getWfoSummaryCardHeaderStyles } from './styles';

export type WfoSummaryCardHeaderProps = {
  text: string;
  value: number | string;
  iconType: IconType;
  iconColor: string | undefined;
  isFetching?: boolean;
};

export const WfoSummaryCardHeader: FC<WfoSummaryCardHeaderProps> = ({
  text,
  value,
  iconType,
  iconColor,
  isFetching,
}) => {
  const { theme } = useOrchestratorTheme();
  const { avatarStyle, totalSectionStyle, valueStyle } = useWithOrchestratorTheme(getWfoSummaryCardHeaderStyles);

  return (
    <EuiFlexItem grow={0}>
      <EuiPanel hasShadow={false} css={{ backgroundColor: theme.colors.backgroundBaseSubdued }} paddingSize="l">
        <EuiFlexGroup alignItems="center">
          <EuiAvatar
            iconSize="l"
            size="xl"
            type="space"
            name={text}
            css={avatarStyle}
            iconType={iconType}
            iconColor={theme.colors.textGhost}
            color={iconColor}
          />
          <div css={totalSectionStyle}>
            <EuiText color="subdued">{text}</EuiText>
            <EuiFlexGroup gutterSize="s" alignItems="center">
              <EuiText css={valueStyle}>{value}</EuiText>
              {isFetching && <EuiLoadingSpinner />}
            </EuiFlexGroup>
          </div>
        </EuiFlexGroup>
      </EuiPanel>
    </EuiFlexItem>
  );
};
