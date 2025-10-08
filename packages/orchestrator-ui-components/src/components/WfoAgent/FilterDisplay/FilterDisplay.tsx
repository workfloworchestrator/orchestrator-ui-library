import React from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { WfoBadge } from '@/components/WfoBadges';
import { WfoPathBreadcrumb } from '@/components/WfoSearchPage/WfoSearchResults/WfoPathBreadcrumb';
import {
    getOperatorDisplay,
    isCondition,
} from '@/components/WfoSearchPage/utils';
import { useWithOrchestratorTheme } from '@/index';
import { AnySearchParameters, Condition, Group, PathDataType } from '@/types';

import { getFilterDisplayStyles } from './styles';

const DEPTH_INDENT = 16;

type FilterDisplayProps = {
    parameters: {
        action?: AnySearchParameters['action'] | string;
        entity_type?: AnySearchParameters['entity_type'] | string;
        filters?: Group | null;
        query?: string | null;
    };
};

interface BetweenValue {
    start?: string | number;
    end?: string | number;
    from?: string | number;
    to?: string | number;
}

export function FilterDisplay({ parameters }: FilterDisplayProps) {
    const t = useTranslations('agent.page');

    const {
        wrapStyle,
        columnGroupWrapStyle,
        chipStyle,
        groupStyle,
        operatorStyle,
        valueStyle,
    } = useWithOrchestratorTheme(getFilterDisplayStyles);
    const { action, entity_type, filters, query } = parameters ?? {};

    if (!parameters || Object.keys(parameters).length === 0) return null;

    const sectionTitle = (text: string) => (
        <EuiText size="xs" color="subdued">
            <strong>{text}</strong>
        </EuiText>
    );

    const formatFilterValue = (condition: Condition['condition']): string => {
        if ('value' in condition && condition.value !== undefined) {
            if (
                condition.op === 'between' &&
                condition.value &&
                typeof condition.value === 'object'
            ) {
                const { start, end, from, to } =
                    condition.value as BetweenValue;
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

        const areChildrenGroups =
            group.children.length > 0 && !isCondition(group.children[0]);

        return (
            <div css={groupStyle} style={{ marginLeft: depth * DEPTH_INDENT }}>
                <div css={operatorStyle}>{group.op}</div>
                <div css={areChildrenGroups ? columnGroupWrapStyle : wrapStyle}>
                    {group.children.map((child, i) => (
                        <div key={i}>
                            {isCondition(child) ? (
                                <div css={chipStyle}>
                                    <WfoPathBreadcrumb
                                        path={child.path}
                                        size="s"
                                        showArrows={true}
                                    />
                                    <WfoBadge
                                        textColor="default"
                                        color="hollow"
                                    >
                                        {
                                            getOperatorDisplay(
                                                child.condition.op,
                                                child.value_kind
                                                    ? {
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
                                    <span css={valueStyle}>
                                        {formatFilterValue(child.condition)}
                                    </span>
                                </div>
                            ) : (
                                renderFilterGroup(child, depth + 1)
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <EuiPanel hasBorder paddingSize="m">
            <EuiFlexGroup gutterSize="m" wrap responsive>
                <EuiFlexItem grow={false}>
                    {sectionTitle(t('action'))}
                    <EuiSpacer size="xs" />
                    <WfoBadge textColor="default" color="hollow">
                        {action || 'N/A'}
                    </WfoBadge>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    {sectionTitle(t('entityType'))}
                    <EuiSpacer size="xs" />
                    <WfoBadge textColor="default" color="hollow">
                        {entity_type || 'N/A'}
                    </WfoBadge>
                </EuiFlexItem>

                {query ? (
                    <EuiFlexItem grow={false}>
                        {sectionTitle(t('searchQuery'))}
                        <EuiSpacer size="xs" />
                        <EuiText size="s">
                            <em>"{query}"</em>
                        </EuiText>
                    </EuiFlexItem>
                ) : null}
            </EuiFlexGroup>

            <EuiSpacer size="m" />
            {sectionTitle(t('activeFilters'))}
            <EuiSpacer size="s" />

            {filters && filters.children && filters.children.length > 0 ? (
                renderFilterGroup(filters)
            ) : (
                <EuiText size="s" color="subdued">
                    <em>{t('noFiltersApplied')}</em>
                </EuiText>
            )}
        </EuiPanel>
    );
}
