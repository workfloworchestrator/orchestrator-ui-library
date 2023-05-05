import React, { useState } from 'react';
import {
    EuiAvatar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiToken,
    EuiIcon,
    EuiListGroupItem,
    EuiText,
} from '@elastic/eui';

export const TreeNode = ({ item, hasChildren, level, onToggle }) => {
    const [expanded, setExpanded] = useState(item.parent === null);
    const [selected, setSelected] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
        onToggle();
    };

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
                    {hasChildren && (
                        <EuiIcon type={expandIcon} onClick={toggleExpand} />
                    )}
                    {!hasChildren && <EuiToken iconType={item.icon} />}
                </EuiFlexItem>
                <EuiFlexItem grow={true}>
                    {selected ? (
                        <EuiListGroupItem
                            onClick={() => setSelected(false)}
                            label={item.label}
                            isActive={selected}
                            href={'#'}
                            extraAction={{
                                color: 'primary',
                                onClick: () => setSelected(false),
                                iconType: 'cross',
                                iconSize: 's',
                                'aria-label': 'Deselect',
                                alwaysShow: true,
                            }}
                        />
                    ) : (
                        <EuiListGroupItem
                            onClick={() => setSelected(true)}
                            label={item.label}
                            isActive={selected}
                            href={'#'}
                        />
                    )}
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
