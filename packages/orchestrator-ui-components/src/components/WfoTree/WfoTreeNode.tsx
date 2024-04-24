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

import { getStyles } from './styles';

type Item = {
    id: number;
    icon: string;
    label: string | number | boolean;
};

type WfoTreeNodeProps = {
    item: Item;
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
                        />
                    ) : (
                        <EuiListGroupItem
                            onClick={() => toggleSelectedId(item.id)}
                            label={item.label}
                            isActive={selected}
                            style={{ borderRadius: 6 }}
                        />
                    )}
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
