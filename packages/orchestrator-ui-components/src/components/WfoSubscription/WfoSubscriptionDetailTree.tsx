import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    EuiButtonIcon,
    EuiCallOut,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSearchBar,
    EuiText,
} from '@elastic/eui';

import { ProductBlockInstance, TreeBlock, WfoTreeNodeMap } from '../../types';
import { WfoTree } from '../WfoTree';
import { TreeContext, TreeContextType } from '../../contexts';
import { getTokenName } from '../../utils/getTokenName';
import { WfoLoading } from '../WfoLoading';
import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
} from './utils';
import { WfoSubscriptionProductBlock } from './WfoSubscriptionProductBlock';
import { getWfoTreeNodeDepth } from '../WfoTree';

interface WfoSubscriptionDetailTreeProps {
    productBlockInstances: ProductBlockInstance[];
}

export const WfoSubscriptionDetailTree = ({
    productBlockInstances,
}: WfoSubscriptionDetailTreeProps) => {
    const t = useTranslations('subscriptions.detail');
    const [, setSelectedTreeNode] = useState(-1);

    const { selectedIds, resetSelection } = React.useContext(
        TreeContext,
    ) as TreeContextType;

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
        };

        // Does this node have a parent?
        if (shallowCopy.parent === null) {
            // Doesn't look like it, so this node is the root of the tree
            shallowCopy.label = getFieldFromProductBlockInstanceValues(
                shallowCopy.productBlockInstanceValues,
                'name',
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
            if (parentNode.children && Array.isArray(parentNode.children)) {
                parentNode.children.push(shallowCopy);
            }
        }

        // Add an entry for this node to the map so that any future children can look up the parent
        idToNodeMap[shallowCopy.id] = shallowCopy;
    });

    if (!tree) return null;

    return (
        <EuiFlexGroup style={{ marginTop: 15 }}>
            <EuiFlexItem style={{ maxWidth: 450, width: 450 }}>
                <EuiFlexGroup direction={'column'}>
                    <EuiFlexItem grow={false}>
                        <EuiFlexGroup>
                            <EuiFlexItem grow={false}>
                                <EuiText>
                                    <h3>{t('productBlocks')}</h3>
                                </EuiText>
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
                        {!tree && <WfoLoading />}
                        {tree && (
                            <WfoTree data={[tree]} depthList={depthList} />
                        )}
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
                            title={t('noProductBlockSelected')}
                            iconType="inspect"
                        >
                            <p>{t('ctaSelectProductBlock')} </p>
                        </EuiCallOut>
                    )}
                    {selectedIds.length !== 0 &&
                        selectedIds.map((id, index) => {
                            const block =
                                productBlockInstances[selectedIds[index]];
                            return (
                                <WfoSubscriptionProductBlock
                                    key={index}
                                    o
                                    subscriptionInstanceId={
                                        block.subscriptionInstanceId
                                    }
                                    productBlockInstanceValues={
                                        block.productBlockInstanceValues
                                    }
                                    id={id}
                                />
                            );
                        })}
                </div>
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
