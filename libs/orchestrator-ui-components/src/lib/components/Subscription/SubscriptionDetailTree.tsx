import React, { useState } from 'react';
import {
    ProductBlock,
    SubscriptionContext,
    SubscriptionContextType,
    Tree,
    TreeContext,
    TreeContextType,
} from '@orchestrator-ui/orchestrator-ui-components';
import { getTokenName } from '../../../../../../apps/example-orchestrator-ui/components/Subscription/utils';
import {
    EuiButtonIcon,
    EuiCallOut,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingContent,
    EuiSearchBar,
    EuiText,
} from '@elastic/eui';

export const SubscriptionDetailTree = () => {
    const [expandAllActive, setExpandAllActive] = useState(false);
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
            expandAll(100);
        }
        setExpandAllActive(!expandAllActive);
    };

    let tree = null; // Initially set our loop to null
    if (loadingStatus > 0) {
        const idToNodeMap = {}; // Keeps track of nodes using id as key, for fast lookup

        // loop over data
        subscriptionData.subscription?.productBlocks.forEach(function (datum) {
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            const shallowCopy: any = { ...datum };

            // Each node will have children, so let's give it a "children" property
            shallowCopy.children = [];

            // Add an entry for this node to the map so that any future children can lookup the parent
            idToNodeMap[shallowCopy.id] = shallowCopy;

            // Does this node have a parent?
            if (shallowCopy.parent === null) {
                // Doesn't look like it, so this node is the root of the tree
                shallowCopy.label = shallowCopy.resourceTypes.name;
                shallowCopy.callback = () =>
                    setSelectedTreeNode(shallowCopy.id);
                tree = shallowCopy;
            } else {
                // This node has a parent, so let's look it up using the id
                const parentNode = idToNodeMap[shallowCopy.parent];
                shallowCopy.label =
                    shallowCopy.resourceTypes.title.length > 45
                        ? `${shallowCopy.resourceTypes.title.substring(
                              0,
                              45,
                          )}...`
                        : shallowCopy.resourceTypes.title;
                shallowCopy.callback = () =>
                    setSelectedTreeNode(shallowCopy.id);

                // Let's add the current node as a child of the parent node.
                if (
                    !subscriptionData.subscription.productBlocks.find(
                        (i) => i.parent === shallowCopy.id,
                    )
                ) {
                    shallowCopy.icon = getTokenName(shallowCopy.label);
                }

                parentNode.children.push(shallowCopy);
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
                        {tree === null && <EuiLoadingContent />}
                        {tree !== null && <Tree data={[tree]} />}
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
                                    subscriptionData.subscription.productBlocks[
                                        selectedIds[index]
                                    ].resourceTypes.title,
                                    subscriptionData.subscription.productBlocks[
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
