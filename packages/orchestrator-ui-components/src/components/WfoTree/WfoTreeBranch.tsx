import React, { FC } from 'react';
import { EuiListGroup } from '@elastic/eui';

import { WfoTreeNode } from './WfoTreeNode';
import { TreeBlock } from '../../types';
import { TreeContext, TreeContextType } from '../../contexts/TreeContext';

type WfoTreeBranchProps = {
    item: TreeBlock;
    level: number;
};

export const WfoTreeBranch: FC<WfoTreeBranchProps> = ({ item, level }) => {
    const { expandedIds } = React.useContext(TreeContext) as TreeContextType;
    const selected = expandedIds.includes(item.id);

    const hasChildren = item.children && item.children.length !== 0;

    const renderBranches = () => {
        if (hasChildren) {
            const newLevel = level + 1;

            return item.children.map((child) => (
                <WfoTreeBranch key={child.id} item={child} level={newLevel} />
            ));
        }

        return null;
    };

    return (
        <>
            <EuiListGroup flush={true} color="primary" maxWidth={455}>
                <WfoTreeNode
                    item={item}
                    hasChildren={hasChildren}
                    level={level}
                />
            </EuiListGroup>

            {selected && renderBranches()}
        </>
    );
};
