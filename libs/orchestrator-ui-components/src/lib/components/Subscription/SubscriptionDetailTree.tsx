import React, { useState } from 'react';
import { ProductBlockBase, ResourceTypeBase, TreeBlock } from '../../types';
import { ProductBlock } from './ProductBlock';
import {
    SubscriptionContext,
    SubscriptionContextType,
} from '../../contexts/SubscriptionContext';
import { Tree } from '../Tree/Tree';
import { TreeContext, TreeContextType } from '../../contexts/TreeContext';

import {
    EuiButtonIcon,
    EuiCallOut,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingContent,
    EuiSearchBar,
    EuiText,
} from '@elastic/eui';

import { getTokenName } from '../../utils/getTokenName';

interface TreeBlockOptional extends ProductBlockBase {
    icon?: string;
    label?: string;
    callback?: () => void;
    children?: TreeBlock;
}

type NodeMap = { [key: number]: TreeBlock | TreeBlockOptional };

const MAX_LABEL_LENGTH = 45;
const MAX_EXPAND_ALL = 100;

function getProductBlockTitle(resourceType: ResourceTypeBase): string {
    if (!resourceType.title) return resourceType.name;
    return resourceType.title?.length > MAX_LABEL_LENGTH
        ? `${resourceType.title.substring(0, MAX_LABEL_LENGTH)}...`
        : resourceType.title;
}

export const SubscriptionDetailTree = () => {
    const [expandAllActive, setExpandAllActive] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedTreeNode, setSelectedTreeNode] = useState(-1);

    const { subscriptionData, loadingStatus } = React.useContext(
        SubscriptionContext,
    ) as SubscriptionContextType;

    const { selectedIds, collapseAll, expandAll, resetSelection } =
        React.useContext(TreeContext) as TreeContextType;

    const toggleExpandAll = () => {
        if (expandAllActive) {
            collapseAll();
        } else {
            expandAll(MAX_EXPAND_ALL);
        }
        setExpandAllActive(!expandAllActive);
    };

    let tree: TreeBlock | null = null;
    if (loadingStatus > 0) {
        const idToNodeMap: NodeMap = {}; // Keeps track of nodes using id as key, for fast lookup

        // loop over data
        subscriptionData.productBlocks.forEach((productBlock) => {
            const shallowCopy: TreeBlockOptional = { ...productBlock };

            // Each node will have children, so let's give it a "children" property
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            shallowCopy.children = [];

            // Add an entry for this node to the map so that any future children can lookup the parent
            idToNodeMap[shallowCopy.id] = shallowCopy;

            // Does this node have a parent?
            if (shallowCopy.parent === null) {
                // Doesn't look like it, so this node is the root of the tree
                shallowCopy.label = shallowCopy.resourceTypes.name;
                shallowCopy.callback = () =>
                    setSelectedTreeNode(shallowCopy.id);

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tree = shallowCopy as TreeBlock;
            } else {
                // This node has a parent, so let's look it up using the id
                const parentNode = idToNodeMap[shallowCopy.parent];
                shallowCopy.label = getProductBlockTitle(
                    shallowCopy.resourceTypes,
                );
                shallowCopy.callback = () =>
                    setSelectedTreeNode(shallowCopy.id);

                if (
                    !subscriptionData.productBlocks.find(
                        (i) => i.parent === shallowCopy.id,
                    )
                ) {
                    shallowCopy.icon = getTokenName(shallowCopy.label);
                }

                // Let's add the current node as a child of the parent node.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                parentNode.children?.push(shallowCopy);
            }
        });
        console.log('Tree', tree);
    }
    if (!tree) return null;

    return (
        <EuiFlexGroup style={{ marginTop: 15 }}>
            <EuiFlexItem style={{ maxWidth: 450, width: 450 }}>
                <EuiFlexGroup direction={'column'}>
                    <EuiFlexItem grow={false}>
                        <EuiFlexGroup>
                            <EuiFlexItem grow={false}>
                                <EuiText>
                                    <h3>Product blocks</h3>
                                </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiButtonIcon
                                    iconType={
                                        expandAllActive ? 'minimize' : 'expand'
                                    }
                                    onClick={toggleExpandAll}
                                />
                            </EuiFlexItem>
                            <EuiFlexItem grow={true}>
                                {selectedIds.length > 0 && (
                                    <EuiButtonIcon
                                        iconType="error"
                                        onClick={resetSelection}
                                    />
                                )}
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiFlexItem>
                    <EuiFlexItem grow={true}>
                        {!tree && <EuiLoadingContent />}
                        {tree && <Tree data={[tree]} />}
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={true}>
                <div>
                    <EuiSearchBar />
                    {selectedIds.length === 0 && (
                        <EuiCallOut
                            style={{
                                marginTop: 15,
                                minHeight: 600,
                            }}
                            size="m"
                            title="No product block selected"
                            iconType="inspect"
                        >
                            <p>
                                Select one or more product blocks to view their
                                details
                            </p>
                        </EuiCallOut>
                    )}
                    {selectedIds.length !== 0 &&
                        selectedIds
                            .reverse()
                            .map((id, index) =>
                                ProductBlock(
                                    subscriptionData.productBlocks[
                                        selectedIds[index]
                                    ].resourceTypes,
                                    id,
                                ),
                            )}
                </div>
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
