import React, { FC } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiToken } from '@elastic/eui';

import { WfoTreeNodeListItem } from '@/components/WfoTree/WfoTreeNodeListItem';
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
    const { expandIconContainerStyle, treeContainerStyle } =
        useWithOrchestratorTheme(getStyles);
    const { expandedIds, collapseNode, expandNode, selectedIds } =
        React.useContext(TreeContext) as TreeContextType;
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
                <EuiFlexItem>
                    <WfoTreeNodeListItem item={item} selected={selected} />
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
