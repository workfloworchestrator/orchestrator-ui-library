import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiText } from '@elastic/eui';

import { WfoBadge } from '@/components/WfoBadges';
import { WfoPathBreadcrumb } from '@/components/WfoSearchPage/WfoSearchResults/WfoPathBreadcrumb';
import { getOperatorDisplay, isCondition } from '@/components/WfoSearchPage/utils';
import { useWithOrchestratorTheme } from '@/hooks';
import { Condition, Group, PathDataType } from '@/types';

import { getFilterDisplayStyles } from './SetFilterTreeDisplay.styles';

const DEPTH_INDENT = 16;

interface BetweenValue {
  start?: string | number;
  end?: string | number;
  from?: string | number;
  to?: string | number;
}

type SetFilterTreeDisplayProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters: any;
};

export const SetFilterTreeDisplay = ({ parameters }: SetFilterTreeDisplayProps) => {
  const t = useTranslations('agent.page');
  const { wrapStyle, columnGroupWrapStyle, chipStyle, groupStyle, operatorStyle, valueStyle } =
    useWithOrchestratorTheme(getFilterDisplayStyles);

  // Parameters might be the Group directly, or wrapped in a filters property
  const filters = (parameters?.filters || parameters) as Group;

  const formatFilterValue = (condition: Condition['condition']): string => {
    if ('value' in condition && condition.value !== undefined) {
      if (condition.op === 'between' && condition.value && typeof condition.value === 'object') {
        const { start, end, from, to } = condition.value as BetweenValue;
        const fromVal = start || from;
        const toVal = end || to;
        return `${fromVal} … ${toVal}`;
      }
      return String(condition.value);
    }
    return '—';
  };

  const renderFilterGroup = (group: Group, depth = 0): React.ReactNode => {
    if (!group.children || group.children.length === 0) {
      return (
        <EuiText size="s" color="subdued">
          <em>{t('emptyGroup')}</em>
        </EuiText>
      );
    }

    const areChildrenGroups = group.children.length > 0 && !isCondition(group.children[0]);

    return (
      <div css={groupStyle} style={{ marginLeft: depth * DEPTH_INDENT }}>
        <div css={operatorStyle}>{group.op}</div>
        <div css={areChildrenGroups ? columnGroupWrapStyle : wrapStyle}>
          {group.children.map((child, i) => (
            <div key={i}>
              {isCondition(child) ?
                <div css={chipStyle}>
                  <WfoPathBreadcrumb path={child.path} size="s" showArrows={true} />
                  <WfoBadge textColor="default" color="hollow">
                    {
                      getOperatorDisplay(
                        child.condition.op,
                        child.value_kind ?
                          {
                            path: child.path,
                            type: child.value_kind as PathDataType,
                            operators: [],
                            value_schema: {},
                            group: 'leaf' as const,
                          }
                        : undefined,
                      ).symbol
                    }
                  </WfoBadge>
                  <span css={valueStyle}>{formatFilterValue(child.condition)}</span>
                </div>
              : renderFilterGroup(child, depth + 1)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!filters || !filters.children || filters.children.length === 0) {
    return (
      <EuiText size="s" color="subdued">
        <em>{t('noFiltersApplied')}</em>
      </EuiText>
    );
  }

  return <div>{renderFilterGroup(filters)}</div>;
};
