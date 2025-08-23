import {
    EuiBadge,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiPanel,
    EuiSpacer,
    EuiText,
    useEuiTheme,
} from '@elastic/eui';
import { css } from '@emotion/react';

import { AnySearchParameters, Condition, Group } from '@/types';

type FilterDisplayProps = {
    parameters: {
        action?: AnySearchParameters['action'] | string;
        entity_type?: AnySearchParameters['entity_type'] | string;
        filters?: Group | null;
        query?: string | null;
    };
};

const isCondition = (item: Group | Condition): item is Condition => {
    return 'path' in item && 'condition' in item;
};

export function FilterDisplay({ parameters }: FilterDisplayProps) {
    const { euiTheme } = useEuiTheme();
    const { action, entity_type, filters, query } = parameters ?? {};

    if (!parameters || Object.keys(parameters).length === 0) return null;

    const wrapCss = css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: euiTheme.size.s,
    });

    const columnGroupWrapCss = css({
        display: 'flex',
        flexDirection: 'column',
        gap: euiTheme.size.s,
        alignItems: 'flex-start',
    });

    const chipCss = css({
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: euiTheme.size.xl,
        border: `1px solid ${euiTheme.border.color}`,
        background: euiTheme.colors.lightestShade,
        padding: `${euiTheme.size.s} ${euiTheme.size.m}`,
        lineHeight: 1.1,
        gap: euiTheme.size.s,
    });

    const groupCss = css({
        border: `1px solid ${euiTheme.colors.lightShade}`,
        borderRadius: euiTheme.border.radius.medium,
        padding: euiTheme.size.s,
        margin: euiTheme.size.xs,
        background: euiTheme.colors.emptyShade,
    });

    const operatorCss = css({
        fontFamily: euiTheme.font.familyCode,
        padding: `${euiTheme.size.xs} ${euiTheme.size.s}`,
        borderRadius: euiTheme.size.s,
        background: euiTheme.colors.primary,
        color: euiTheme.colors.ink,
        fontSize: euiTheme.size.m,
        fontWeight: 'bold',
        margin: `${euiTheme.size.xs} 0`,
    });

    const crumbCss = css({
        display: 'inline-flex',
        alignItems: 'center',
        color: euiTheme.colors.subduedText,
        '> span + span': {
            display: 'inline-flex',
            alignItems: 'center',
            marginLeft: euiTheme.size.xs,
            '::before': {
                content: '""',
                display: 'inline-block',
                marginRight: euiTheme.size.xs,
            },
        },
    });

    const opCss = css({
        fontFamily: euiTheme.font.familyCode,
        padding: `0 ${euiTheme.size.s}`,
        borderRadius: euiTheme.size.s,
        background: euiTheme.colors.emptyShade,
        color: euiTheme.colors.text,
    });

    const valueCss = css({
        fontWeight: 600,
        color: euiTheme.colors.warning,
    });

    const sectionTitle = (text: string) => (
        <EuiText size="xs" color="subdued">
            <strong>{text}</strong>
        </EuiText>
    );

    const formatFilterValue = (condition: Condition['condition']): string => {
        if ('value' in condition) {
            if (
                condition.op === 'between' &&
                condition.value &&
                typeof condition.value === 'object'
            ) {
                const { start, end, from, to } = condition.value as any;
                const fromVal = start || from;
                const toVal = end || to;
                return `${fromVal} … ${toVal}`;
            }
            return String(condition.value);
        }
        return '—';
    };

    const renderPathCrumbs = (path: string) => {
        const parts = path.split('.');
        return (
            <span css={crumbCss} title={`Full path: ${path}`}>
                {parts.map((p, i) => (
                    <span key={`${p}-${i}`}>
                        {i > 0 && (
                            <EuiIcon
                                type="sortRight"
                                size="s"
                                css={css({
                                    marginRight: euiTheme.size.xs,
                                    color: euiTheme.colors.subduedText,
                                })}
                            />
                        )}
                        {p}
                    </span>
                ))}
            </span>
        );
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
            <div css={groupCss} style={{ marginLeft: depth * 16 }}>
                <div css={operatorCss}>{group.op}</div>
                <div css={areChildrenGroups ? columnGroupWrapCss : wrapCss}>
                    {group.children.map((child, i) => (
                        <div key={i}>
                            {isCondition(child) ? (
                                <div css={chipCss}>
                                    {renderPathCrumbs(child.path)}
                                    <span css={opCss}>
                                        {child.condition.op}
                                    </span>
                                    <span css={valueCss}>
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
