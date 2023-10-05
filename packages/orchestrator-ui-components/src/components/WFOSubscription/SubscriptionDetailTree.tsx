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

import { ProductBlockInstance, TreeBlock } from '../../types';
import { WFOTree } from '../WFOTree/WFOTree';
import { TreeContext, TreeContextType } from '../../contexts/TreeContext';
import { getTokenName } from '../../utils/getTokenName';
import { WFOLoading } from '../WFOLoading';
import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
} from './utils';
import { SubscriptionProductBlock } from './SubscriptionProductBlock';

type NodeMap = { [key: number]: TreeBlock };

const MAX_EXPAND_ALL = 100;

interface SubscriptionDetailTreeProps {
    productBlockInstances: ProductBlockInstance[];
}

export const SubscriptionDetailTree = ({
    productBlockInstances,
}: SubscriptionDetailTreeProps) => {
    const t = useTranslations('subscriptions.detail');
    const [expandAllActive, setExpandAllActive] = useState(false);
    const [, setSelectedTreeNode] = useState(-1);

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

    const idToNodeMap: NodeMap = {}; // Keeps track of nodes using id as key, for fast lookup

    // TODO: Note, doesn't this code depend to much on the order of the productBlockInstances or is it ok because it's all by reference?
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

            tree = shallowCopy;
        } else {
            // This node has a parent, so let's look it up using the id
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

        // Add an entry for this node to the map so that any future children can lookup the parent
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
                        {!tree && <WFOLoading />}
                        {tree && <WFOTree data={[tree]} />}
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
                        selectedIds.reverse().map((id, index) => {
                            return (
                                <SubscriptionProductBlock
                                    key={index}
                                    productBlockInstanceValues={
                                        productBlockInstances[
                                            selectedIds[index]
                                        ].productBlockInstanceValues
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
