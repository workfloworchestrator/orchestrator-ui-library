import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiListGroupItem,
    EuiToken,
} from '@elastic/eui';

import { TreeContext, TreeContextType } from '@/contexts';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { TreeBlock } from '@/types';

import { getStyles } from './styles';

type WfoTreeNodeProps = {
    item: TreeBlock;
    hasChildren: boolean;
    level: number;
};

export const WfoTreeNode: FC<WfoTreeNodeProps> = ({
    item,
    hasChildren,
    level,
}) => {
    const { theme } = useOrchestratorTheme();
    const {
        expandIconContainerStyle,
        treeContainerStyle,
        treeItemOtherSubscriptionStyle,
    } = useWithOrchestratorTheme(getStyles);
    const t = useTranslations('common');
    const {
        expandedIds,
        collapseNode,
        expandNode,
        selectedIds,
        toggleSelectedId,
    } = React.useContext(TreeContext) as TreeContextType;
    const expanded = expandedIds.includes(item.id);
    const selected = selectedIds.includes(item.id);

    const expandIcon = expanded ? 'arrowDown' : 'arrowRight';

    return (
        <div style={{ paddingLeft: `${level * parseInt(theme.size.m)}px` }}>
            <EuiFlexGroup>
                <EuiFlexItem grow={false} css={treeContainerStyle}>
                    {hasChildren ? (
                        <EuiIcon
                            type={expandIcon}
                            css={expandIconContainerStyle}
                            cursor={'hand'}
                            onClick={() =>
                                expanded
                                    ? collapseNode(item.id)
                                    : expandNode(item.id)
                            }
                        />
                    ) : (
                        <EuiToken iconType={item.icon} />
                    )}
                </EuiFlexItem>
                <EuiFlexItem grow={true}>
                    {selected ? (
                        <EuiListGroupItem
                            onClick={() => toggleSelectedId(item.id)}
                            label={item.label}
                            isActive={selected}
                            color={'primary'}
                            style={{ borderRadius: 6 }}
                            extraAction={{
                                color: 'primary',
                                onClick: () => toggleSelectedId(item.id),
                                iconType: 'error',
                                iconSize: 's',
                                'aria-label': t('deselect'),
                                alwaysShow: true,
                            }}
                            css={
                                item.outsideCurrentSubscription &&
                                treeItemOtherSubscriptionStyle
                            }
                        />
                    ) : (
                        <EuiListGroupItem
                            onClick={() => toggleSelectedId(item.id)}
                            label={item.label}
                            isActive={selected}
                            style={{
                                borderRadius: 6,
                            }}
                            css={
                                item.outsideCurrentSubscription &&
                                treeItemOtherSubscriptionStyle
                            }
                        />
                    )}
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
