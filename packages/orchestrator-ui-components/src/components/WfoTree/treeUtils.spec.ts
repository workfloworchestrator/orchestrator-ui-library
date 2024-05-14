import { FieldValue, TreeBlock } from '../../types';
import { getWfoTreeNodeDepth } from './treeUtils';

describe('getWfoTreeNodeDepth', () => {
    const field: FieldValue = { field: 'test', value: 'test' };
    const sampleTree: TreeBlock = {
        id: 1,
        ownerSubscriptionId: 'subscription-1',
        subscriptionInstanceId: 'subscription-1',
        parent: null,
        icon: 'folder',
        label: 'Root',
        callback: jest.fn(),
        productBlockInstanceValues: [field],
        inUseByRelations: [],
        isOutsideCurrentSubscription: false,
        children: [
            {
                id: 2,
                ownerSubscriptionId: 'subscription-2',
                subscriptionInstanceId: 'subscription-2',
                parent: 1,
                icon: 'file',
                label: 'File 1',
                callback: jest.fn(),
                productBlockInstanceValues: [field],
                inUseByRelations: [],
                children: [],
                isOutsideCurrentSubscription: false,
            },
            {
                id: 3,
                ownerSubscriptionId: 'subscription-3',
                subscriptionInstanceId: 'subscription-3',
                parent: 1,
                icon: 'file',
                label: 'File 2',
                callback: jest.fn(),
                productBlockInstanceValues: [field],
                inUseByRelations: [],
                isOutsideCurrentSubscription: false,
                children: [
                    {
                        id: 4,
                        ownerSubscriptionId: 'subscription-4',
                        subscriptionInstanceId: 'subscription-4',
                        parent: 3,
                        icon: 'file',
                        label: 'File 2.1',
                        callback: jest.fn(),
                        productBlockInstanceValues: [field],
                        inUseByRelations: [],
                        children: [],
                        isOutsideCurrentSubscription: false,
                    },
                ],
            },
        ],
    };

    const idToNodeMap = {
        1: sampleTree,
        2: sampleTree.children[0],
        3: sampleTree.children[1],
        4: sampleTree.children[1].children[0],
    };

    it('should return 0 for the root node', () => {
        const rootDepth = getWfoTreeNodeDepth(sampleTree, idToNodeMap);
        expect(rootDepth).toBe(0);
    });

    it('should return the correct depth for a child node', () => {
        const depth2 = getWfoTreeNodeDepth(sampleTree.children[0], idToNodeMap);
        const depth3 = getWfoTreeNodeDepth(sampleTree.children[1], idToNodeMap);
        const depth4 = getWfoTreeNodeDepth(
            sampleTree.children[1].children[0],
            idToNodeMap,
        );

        expect(depth2).toBe(1);
        expect(depth3).toBe(1);
        expect(depth4).toBe(2);
    });

    it('should throw an error if the parent node is not found', () => {
        const invalidNode = {
            id: 1,
            ownerSubscriptionId: 'subscription-1',
            subscriptionInstanceId: 'subscription-1',
            parent: 99, // Parent ID that does not exist
            icon: 'file',
            label: 'Invalid Node',
            callback: jest.fn(),
            productBlockInstanceValues: [field],
            inUseByRelations: [],
            children: [],
            isOutsideCurrentSubscription: false,
        };

        expect(() =>
            getWfoTreeNodeDepth(invalidNode, idToNodeMap),
        ).toThrowError('Parent node for 1 not found.');
    });
});
