import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { WfoLoading, WfoTextAnchor } from '@/components';
import { TreeContext, TreeContextType } from '@/contexts';
import {
    ProductBlockInstance,
    Subscription,
    TreeBlock,
    WfoTreeNodeMap,
} from '@/types';

import { getTokenName } from '../../utils/getTokenName';
import { WfoTree, getPositionInTree, sortTreeBlockByLabel } from '../WfoTree';
import { getWfoTreeNodeDepth } from '../WfoTree';
import { WfoSubscriptionProductBlock } from './WfoSubscriptionProductBlock';
import { getProductBlockTitle } from './utils';

interface WfoSubscriptionDetailTreeProps {
    productBlockInstances: ProductBlockInstance[];
    subscriptionId: Subscription['subscriptionId'];
}

export const WfoSubscriptionDetailTree = ({
    productBlockInstances,
    subscriptionId,
}: WfoSubscriptionDetailTreeProps) => {
    const t = useTranslations('subscriptions.detail');
    const [, setSelectedTreeNode] = useState(-1);

    const { selectedIds, expandAll, collapseAll, resetSelection, selectAll } =
        React.useContext(TreeContext) as TreeContextType;

    let tree: TreeBlock | null = null;
    const depthList: number[] = [];

    const idToNodeMap: WfoTreeNodeMap = {}; // Keeps track of nodes using id as key, for fast lookup

    productBlockInstances.forEach((productBlockInstance) => {
        const shallowCopy: TreeBlock = {
            ...productBlockInstance,
            icon: '',
            label: '',
            callback: () => {},
            children: [],
            isOutsideCurrentSubscription:
                productBlockInstance.subscription.subscriptionId !==
                subscriptionId,
        };

        // Does this node have a parent?
        if (shallowCopy.parent === null) {
            // Doesn't look like it, so this node is the root of the tree
            shallowCopy.label = getProductBlockTitle(
                shallowCopy.productBlockInstanceValues,
            );
            shallowCopy.callback = () => setSelectedTreeNode(shallowCopy.id);
            depthList.push(0); // First id is on root
            tree = shallowCopy;
        } else {
            // This node has a parent, so let's look it up using the id
            depthList.push(getWfoTreeNodeDepth(shallowCopy, idToNodeMap));
            const parentNode = idToNodeMap[shallowCopy.parent];
            shallowCopy.label = getProductBlockTitle(
                shallowCopy.productBlockInstanceValues,
            );
            shallowCopy.callback = () => setSelectedTreeNode(shallowCopy.id);

            if (
                !productBlockInstances.find((i) => i.parent === shallowCopy.id)
            ) {
                shallowCopy.icon = getTokenName(shallowCopy.label);
            }

            // Let's add the current node as a child of the parent node.
            // We want them to be in order, so we'll sort them by label.
            if (parentNode.children && Array.isArray(parentNode.children)) {
                parentNode.children = [
                    ...parentNode.children,
                    shallowCopy,
                ].sort(sortTreeBlockByLabel);
            }
        }

        // Add an entry for this node to the map so that any future children can look up the parent
        idToNodeMap[shallowCopy.id] = shallowCopy;
    });

    const toggleShowAll = () => {
        if (selectedIds.length === productBlockInstances.length) {
            resetSelection();
            collapseAll();
        } else {
            selectAll();
            expandAll();
        }
    };

    if (!tree) return null;

    /*
     * The order of displayed product blocks should be the same as the order in the tree. Because we sort the tree
     * alphabetically per level we can not depend on the order of product block ids anymore so we sort by the position in the tree.
     */
    const sortByTree = (idA: number, idB: number) => {
        if (!tree) return 0;

        const positionA = getPositionInTree(tree, idA);
        const positionB = getPositionInTree(tree, idB);
        if (!positionA || !positionB) return 0;

        if (positionA < positionB) {
            return -1;
        }
        if (positionA > positionB) {
            return 1;
        }
        return 0;
    };

    return (
        <EuiFlexGroup style={{ marginTop: 15 }}>
            <EuiFlexItem style={{ maxWidth: 450, width: 450 }}>
                <EuiFlexGroup direction={'column'}>
                    <EuiFlexItem grow={false}>
                        <EuiFlexGroup
                            justifyContent="spaceBetween"
                            alignItems="center"
                        >
                            <EuiFlexItem>
                                <EuiText>
                                    <h3>{t('productBlocks')}</h3>
                                </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <WfoTextAnchor
                                    text={t(
                                        selectedIds.length ===
                                            productBlockInstances.length
                                            ? 'hideAll'
                                            : 'showAll',
                                    )}
                                    onClick={toggleShowAll}
                                />
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiFlexItem>
                    <EuiFlexItem grow={true}>
                        {!tree && <WfoLoading />}
                        {tree && (
                            <WfoTree
                                treeBlocks={[tree]}
                                depthList={depthList}
                            />
                        )}
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={true}>
                <div>
                    <div>&nbsp;</div>{' '}
                    {/* This is a placeholder for the searchbar */}
                    {selectedIds.length === 0 && (
                        <EuiCallOut
                            style={{
                                marginTop: 15,
                                minHeight: 600,
                                borderRadius: 6,
                            }}
                            size="m"
                            title={t('noProductBlockSelected')}
                            iconType="inspect"
                        >
                            <p>{t('ctaSelectProductBlock')} </p>
                        </EuiCallOut>
                    )}
                    {selectedIds.length !== 0 &&
                        selectedIds.sort(sortByTree).map((id, index) => {
                            const block = idToNodeMap[id];
                            return (
                                <WfoSubscriptionProductBlock
                                    key={index}
                                    subscriptionId={subscriptionId}
                                    productBlock={block}
                                />
                            );
                        })}
                </div>
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
