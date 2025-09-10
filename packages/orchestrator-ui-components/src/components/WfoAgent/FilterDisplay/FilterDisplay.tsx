import React from 'react';

import {
    EuiBadge,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
    useEuiTheme,
} from '@elastic/eui';

import { WfoPathBreadcrumb } from '@/components/WfoSearchPage/WfoSearchResults/WfoPathBreadcrumb';
import {
    getOperatorDisplay,
    isCondition,
} from '@/components/WfoSearchPage/utils';
import { AnySearchParameters, Condition, Group, PathDataType } from '@/types';

import { getFilterDisplayStyles } from './FilterDisplay.styles';

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
    const { euiTheme } = useEuiTheme();
    const { action, entity_type, filters, query } = parameters ?? {};

    if (!parameters || Object.keys(parameters).length === 0) return null;

    const styles = getFilterDisplayStyles(euiTheme);

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
                    <em>Empty group</em>
                </EuiText>
            );
        }

        const areChildrenGroups =
            group.children.length > 0 && !isCondition(group.children[0]);

        return (
            <div
                css={styles.group}
                style={{ marginLeft: depth * DEPTH_INDENT }}
            >
                <div css={styles.operator}>{group.op}</div>
                <div
                    css={
                        areChildrenGroups ? styles.columnGroupWrap : styles.wrap
                    }
                >
                    {group.children.map((child, i) => (
                        <div key={i}>
                            {isCondition(child) ? (
                                <div css={styles.chip}>
                                    <WfoPathBreadcrumb
                                        path={child.path}
                                        size="s"
                                        showArrows={true}
                                    />
                                    <EuiBadge color="hollow">
                                        {
                                            getOperatorDisplay(
                                                child.condition.op,
                                                child.value_kind
                                                    ? {
                                                          path: child.path,
                                                          type: child.value_kind as PathDataType,
                                                          operators: [],
                                                          valueSchema: {},
                                                          group: 'leaf' as const,
                                                      }
                                                    : undefined,
                                            ).symbol
                                        }
                                    </EuiBadge>
                                    <span css={styles.value}>
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
                    {sectionTitle('Action')}
                    <EuiSpacer size="xs" />
                    <EuiBadge color="hollow">{action || 'N/A'}</EuiBadge>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    {sectionTitle('Entity Type')}
                    <EuiSpacer size="xs" />
                    <EuiBadge color="hollow">{entity_type || 'N/A'}</EuiBadge>
                </EuiFlexItem>

                {query ? (
                    <EuiFlexItem grow={false}>
                        {sectionTitle('Search Query')}
                        <EuiSpacer size="xs" />
                        <EuiText size="s">
                            <em>"{query}"</em>
                        </EuiText>
                    </EuiFlexItem>
                ) : null}
            </EuiFlexGroup>

            <EuiSpacer size="m" />
            {sectionTitle('Active Filters')}
            <EuiSpacer size="s" />

            {filters && filters.children && filters.children.length > 0 ? (
                renderFilterGroup(filters)
            ) : (
                <EuiText size="s" color="subdued">
                    <em>No filters applied.</em>
                </EuiText>
            )}
        </EuiPanel>
    );
}
