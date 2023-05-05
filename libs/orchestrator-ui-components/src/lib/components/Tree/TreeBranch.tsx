import React, { useState } from 'react';

import { TreeNode } from './TreeNode';
import { EuiListGroup } from '@elastic/eui';

export const TreeBranch = ({ item, level }) => {
    const [selected, setSelected] = useState(item.parent === null);

    const hasChildren = item.children && item.children.length !== 0;

    const renderBranches = () => {
        if (hasChildren) {
            const newLevel = level + 1;

            return item.children.map((child) => {
                return (
                    <TreeBranch key={child.id} item={child} level={newLevel} />
                );
            });
        }

        return null;
    };

    const toggleSelected = () => {
        setSelected((prev) => !prev);
    };

    return (
        <>
            <EuiListGroup flush={true} color={'primary'} maxWidth={455}>
                <TreeNode
                    item={item}
                    hasChildren={hasChildren}
                    level={level}
                    onToggle={toggleSelected}
                />
            </EuiListGroup>

            {selected && renderBranches()}
        </>
    );
};
