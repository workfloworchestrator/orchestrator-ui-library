import React, { FC } from 'react';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiToken,
    EuiIcon,
    EuiListGroupItem,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { getStyles } from './styles';
import { TreeContext, TreeContextType } from '../../contexts';
import { useOrchestratorTheme } from '../../hooks';

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
    const { expandIconContainerStyle, treeContainerStyle } = getStyles(theme);
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

    let expandIcon = expanded ? 'arrowDown' : 'arrowRight';
    if (item.id === 0) {
        expandIcon = expanded ? 'folderOpen' : 'folderClosed';
    }

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
                        />
                    )}
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
