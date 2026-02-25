import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { WfoBadge, WfoToolTip } from '@/components';
import { useOrchestratorTheme } from '@/hooks';

import { getTypeColor } from '../utils';
import { PathOptionRenderProps, PathSelectionOptionRenderProps } from './types';

export const WfoRenderPathOption: FC<PathOptionRenderProps> = ({ option, contentClassName, paths }) => {
  const t = useTranslations('search.page');
  const { theme } = useOrchestratorTheme();
  const pathInfo = option.value ? paths.find(({ path }) => path === option.value) : null;

  if (!pathInfo) return <>{option.label}</>;

  return (
    <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false} className={contentClassName} title="">
      <EuiFlexItem grow={true}>
        <EuiText size="s">{pathInfo.displayLabel || pathInfo.path}</EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
          {pathInfo.group === 'leaf' && pathInfo.pathCount && pathInfo.pathCount > 1 && (
            <EuiFlexItem grow={false}>
              <WfoBadge color="default" textColor={theme.colors.textInk} size="xs">
                {t('pathsCount', {
                  count: pathInfo.pathCount,
                })}
              </WfoBadge>
            </EuiFlexItem>
          )}
          {(!pathInfo.pathCount || pathInfo.pathCount <= 1)
            && pathInfo.ui_types?.map((type, index) => (
              <EuiFlexItem key={index} grow={false}>
                <WfoBadge color={getTypeColor(type, theme)} textColor={theme.colors.textInk} size="xs">
                  {type}
                </WfoBadge>
              </EuiFlexItem>
            ))}
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export const WfoRenderPathSelectionOption: FC<PathSelectionOptionRenderProps> = ({
  option,
  contentClassName,
  fieldType,
}) => {
  const { theme } = useOrchestratorTheme();

  return (
    <WfoToolTip tooltipContent={option.fullPath || option.label}>
      <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false} className={contentClassName} title="">
        <EuiFlexItem grow={true}>
          <EuiText size="s">{option.label}</EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <WfoBadge color={getTypeColor(fieldType, theme)} textColor={theme.colors.textInk} size="xs">
            {fieldType}
          </WfoBadge>
        </EuiFlexItem>
      </EuiFlexGroup>
    </WfoToolTip>
  );
};
