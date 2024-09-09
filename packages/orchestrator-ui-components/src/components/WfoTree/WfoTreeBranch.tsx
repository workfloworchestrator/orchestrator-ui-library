import React, { FC } from 'react';

import { EuiListGroup } from '@elastic/eui';

import { getSubscriptionDetailStyles } from '@/components/WfoSubscription/styles';
import { TreeContext, TreeContextType } from '@/contexts';
import { useWithOrchestratorTheme } from '@/hooks';
import { TreeBlock } from '@/types';

import { WfoTreeNode } from './WfoTreeNode';

type WfoTreeBranchProps = {
    item: TreeBlock;
    level: number;
};

export const WfoTreeBranch: FC<WfoTreeBranchProps> = ({ item, level }) => {
    const { expandedIds } = React.useContext(TreeContext) as TreeContextType;
    const selected = expandedIds.includes(item.id);
    const { productBlockTreeWidth } = useWithOrchestratorTheme(
        getSubscriptionDetailStyles,
    );

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
            <EuiListGroup
                flush={true}
                color="primary"
                maxWidth={productBlockTreeWidth}
            >
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
