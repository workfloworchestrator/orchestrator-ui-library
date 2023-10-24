import React, { FC } from 'react';
import { useTranslations } from 'next-intl';
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiToken,
    EuiIcon,
    EuiListGroupItem,
} from '@elastic/eui';
import { TreeContext, TreeContextType } from '../../contexts/TreeContext';

type Item = {
    id: number;
    icon: string;
    label: string | number;
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
    const t = useTranslations('common');
    const { expandedIds, toggleExpandedId, selectedIds, toggleSelectedId } =
        React.useContext(TreeContext) as TreeContextType;
    const expanded = expandedIds.includes(item.id);
    const selected = selectedIds.includes(item.id);

    let expandIcon = expanded ? 'arrowDown' : 'arrowRight';
    if (item.id === 0) {
        expandIcon = expanded ? 'folderOpen' : 'folderClosed';
    }

    return (
        <div style={{ paddingLeft: `${level * 16}px` }}>
            <EuiFlexGroup>
                <EuiFlexItem
                    grow={false}
                    style={{ width: 0, marginTop: 8, marginRight: -8 }}
                >
                    {hasChildren ? (
                        <EuiIcon
                            type={expandIcon}
                            onClick={() => toggleExpandedId(item.id)}
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
