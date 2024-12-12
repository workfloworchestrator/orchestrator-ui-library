import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { PATH_SUBSCRIPTIONS, WfoLoading, WfoTextAnchor } from '@/components';
import { TreeContext, TreeContextType } from '@/contexts';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
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
import { getSubscriptionDetailStyles } from './styles';
import { getProductBlockTitle } from './utils';

interface WfoSubscriptionDetailTreeProps {
    productBlockInstances: ProductBlockInstance[];
    subscriptionId: Subscription['subscriptionId'];
    subscriptionPath?: string;
}

export const WfoSubscriptionDetailTree = ({
    productBlockInstances,
    subscriptionId,
    subscriptionPath = PATH_SUBSCRIPTIONS,
}: WfoSubscriptionDetailTreeProps) => {
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();
    const [, setSelectedTreeNode] = useState(-1);
    const { productBlockTreeWidth } = useWithOrchestratorTheme(
        getSubscriptionDetailStyles,
    );
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

    const headerHeight = 265; // The height of the header part of the page that needs to be subtracted from 100vh to fit the page

    return (
        <EuiFlexGroup
            css={{
                marginTop: 15,
                height: `calc(100vh - ${headerHeight}px)`,
            }}
        >
            <EuiFlexItem
                style={{
                    minWidth: productBlockTreeWidth,
                    maxWidth: productBlockTreeWidth,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}
                grow={true}
            >
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
            <EuiFlexItem
                css={{
                    overflow: 'auto',
                    minWidth: 350,
                }}
                grow={true}
            >
                <div>
                    <div>&nbsp;</div>{' '}
                    {/* This is a placeholder for the searchbar */}
                    {selectedIds.length === 0 && (
                        <EuiCallOut
                            css={{
                                marginTop: theme.size.m,
                                textAlign: 'center',
                            }}
                            size="m"
                            title={t('noProductBlockSelected')}
                            iconType="inspect"
                        >
                            <EuiText>{t('ctaSelectProductBlock')} </EuiText>
                        </EuiCallOut>
                    )}
                    {selectedIds.length !== 0 &&
                        selectedIds.sort(sortByTree).map((id) => {
                            const block = idToNodeMap[id];
                            return (
                                <WfoSubscriptionProductBlock
                                    key={id}
                                    subscriptionId={subscriptionId}
                                    productBlock={block}
                                    subscriptionPath={subscriptionPath}
                                />
                            );
                        })}
                </div>
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
