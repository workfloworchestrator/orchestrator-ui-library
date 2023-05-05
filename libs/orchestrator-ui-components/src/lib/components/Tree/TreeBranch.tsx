import React, { useState } from 'react';

import { TreeNode } from './TreeNode';
import { EuiListGroup } from '@elastic/eui';
import {
    TreeContext,
    TreeContextType,
} from '@orchestrator-ui/orchestrator-ui-components';

export const TreeBranch = ({ item, level }) => {
    const { expandedIds } = React.useContext(TreeContext) as TreeContextType;
    const selected = expandedIds.includes(item.id);

    const hasChildren = item.children && item.children.length !== 0;

    const renderBranches = () => {
        if (hasChildren) {
            const newLevel = level + 1;

            return item.children.map((child) => {
                return (
                    <TreeBranch
                        key={child.id}
                        item={child}
                        level={newLevel}
                        // expandedIds={expandedIds}
                        // onExpandChange={onExpandChange}
                    />
                );
            });
        }

        return null;
    };

    // const toggleSelected = () => {
    //     setSelected((prev) => !prev);
    // };

    return (
        <>
            <EuiListGroup flush={true} color="primary" maxWidth={455}>
                <TreeNode
                    item={item}
                    hasChildren={hasChildren}
                    level={level}
                    // onToggle={toggleSelected}
                    // expandedIds={expandedIds}
                    // onExpandChange={onExpandChange}
                />
            </EuiListGroup>

            {selected && renderBranches()}
        </>
    );
};
