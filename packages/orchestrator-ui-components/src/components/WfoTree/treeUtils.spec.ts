import { FieldValue, TreeBlock, WfoTreeNodeMap } from '@/types';

import { getPositionInTree, getWfoTreeNodeDepth } from './treeUtils';

describe('getWfoTreeNodeDepth', () => {
    const field: FieldValue = { field: 'test', value: 'test' };
    const sampleTree: TreeBlock = {
        id: 1,
        subscriptionInstanceId: 'subscription-1',
        parent: null,
        icon: 'folder',
        label: 'Root',
        callback: jest.fn(),
        productBlockInstanceValues: [field],
        inUseByRelations: [],
        isOutsideCurrentSubscription: false,
        subscription: {
            subscriptionId: 'subscription-1',
            description: 'Subscription 1',
        },
        children: [
            {
                id: 2,
                subscriptionInstanceId: 'subscription-2',
                parent: 1,
                icon: 'file',
                label: 'File 1',
                callback: jest.fn(),
                productBlockInstanceValues: [field],
                inUseByRelations: [],
                children: [],
                isOutsideCurrentSubscription: false,
                subscription: {
                    subscriptionId: 'subscription-2',
                    description: 'Subscription 2',
                },
            },
            {
                id: 3,
                subscriptionInstanceId: 'subscription-3',
                parent: 1,
                icon: 'file',
                label: 'File 2',
                callback: jest.fn(),
                productBlockInstanceValues: [field],
                inUseByRelations: [],
                isOutsideCurrentSubscription: false,
                subscription: {
                    subscriptionId: 'subscription-3',
                    description: 'Subscription 3',
                },
                children: [
                    {
                        id: 4,
                        subscriptionInstanceId: 'subscription-4',
                        parent: 3,
                        icon: 'file',
                        label: 'File 2.1',
                        callback: jest.fn(),
                        productBlockInstanceValues: [field],
                        inUseByRelations: [],
                        children: [],
                        isOutsideCurrentSubscription: false,
                        subscription: {
                            subscriptionId: 'subscription-4',
                            description: 'Subscription 4',
                        },
                    },
                ],
            },
        ],
    };

    const idToNodeMap: WfoTreeNodeMap = {
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
            subscription: {
                subscriptionId: 'subscription-1',
                description: 'Subscription 1',
            },
        };

        expect(() => getWfoTreeNodeDepth(invalidNode, idToNodeMap)).toThrow(
            'Parent node for 1 not found.',
        );
    });
});

describe('getPositionInTree', () => {
    const json = `{
        "id": 0,
        "subscription": {
            "subscriptionId": "556facd3-6399-4c76-aeb1-114849da2f96",
            "description": "AMPATH L3VPN AH001A 215 Mbit/s"
        },
        "parent": null,
        "productBlockInstanceValues": [
        ],
        "subscriptionInstanceId": "7dc29b2c-6af8-4e82-960d-1fca551e5941",
        "inUseByRelations": [],
        "icon": "",
        "label": "L3VPN multipoint service 215 Mbit/s",
        "children": [
            {
                "id": 2,
                "subscription": {
                    "subscriptionId": "556facd3-6399-4c76-aeb1-114849da2f96",
                    "description": "AMPATH L3VPN AH001A 215 Mbit/s"
                },
                "parent": 0,
                "productBlockInstanceValues": [
                ],
                "subscriptionInstanceId": "bcccaec3-ece2-4115-9457-d46d1c4be1c3",
                "inUseByRelations": [
                ],
                "icon": "",
                "label": "L3VPNSAPSS ah001a-jnx-test-floris-1-vtb vlan ...",
                "children": [
                    {
                        "id": 3,
                        "subscription": {
                            "subscriptionId": "556facd3-6399-4c76-aeb1-114849da2f96",
                            "description": "AMPATH L3VPN AH001A 215 Mbit/s"
                        },
                        "parent": 2,
                        "productBlockInstanceValues": [
                        ],
                        "subscriptionInstanceId": "fc213a85-99ac-4efd-8b5d-a57517fba549",
                        "inUseByRelations": [
                        ],
                        "icon": "",
                        "label": "SAP ah001a-jnx-test-floris-1-vtb vlan 13",
                        "children": [
                            {
                                "id": 4,
                                "subscription": {
                                    "subscriptionId": "0a1eab0c-e952-401d-b1ed-20c286a268be",
                                    "description": "AARNETNOC SPNL AH001A 1 Gbit/s"
                                },
                                "parent": 3,
                                "productBlockInstanceValues": [
                                ],
                                "subscriptionInstanceId": "17e52886-dc18-41e3-9ce2-af426914a831",
                                "inUseByRelations": [
                                ],
                                "icon": "",
                                "label": "SP 1G tagged (ah001a-jnx-test-floris-1-vtb)",
                                "children": [
                                    {
                                        "id": 5,
                                        "subscription": {
                                            "subscriptionId": "00e4fbbb-9192-4fac-9066-5d1381c5f0a4",
                                            "description": "Node ah001a-jnx-test-floris-1-vtb Ah001A"
                                        },
                                        "parent": 4,
                                        "productBlockInstanceValues": [
                                        ],
                                        "subscriptionInstanceId": "6ff2d010-9e16-44ed-ac62-b36b9438c7ff",
                                        "inUseByRelations": [
                                        ],
                                        "icon": "tokenConstant",
                                        "label": "Node ah001a-jnx-test-floris-1-vtb",
                                        "children": [],
                                        "isOutsideCurrentSubscription": true
                                    }
                                ],
                                "isOutsideCurrentSubscription": true
                            }
                        ],
                        "isOutsideCurrentSubscription": false
                    }
                ],
                "isOutsideCurrentSubscription": false
            },
            {
                "id": 6,
                "subscription": {
                    "subscriptionId": "556facd3-6399-4c76-aeb1-114849da2f96",
                    "description": "AMPATH L3VPN AH001A 215 Mbit/s"
                },
                "parent": 0,
                "productBlockInstanceValues": [
                ],
                "subscriptionInstanceId": "b7eee7a5-6878-42bf-bbd5-ef442d33334f",
                "inUseByRelations": [
                ],
                "icon": "",
                "label": "L3VPNSAPSS ah001a-jnx-test-floris-1-vtb vlan ...",
                "children": [
                    {
                        "id": 7,
                        "subscription": {
                            "subscriptionId": "556facd3-6399-4c76-aeb1-114849da2f96",
                            "description": "AMPATH L3VPN AH001A 215 Mbit/s"
                        },
                        "parent": 6,
                        "productBlockInstanceValues": [
                        ],
                        "subscriptionInstanceId": "7d67ba27-cc2f-42c6-90a6-d10932531c7a",
                        "inUseByRelations": [
                        ],
                        "icon": "",
                        "label": "SAP ah001a-jnx-test-floris-1-vtb vlan 140",
                        "children": [
                            {
                                "id": 8,
                                "subscription": {
                                    "subscriptionId": "7a8caac1-0203-41f2-9623-b7068c585423",
                                    "description": "KLM SP AH001A 10 Gbit/s"
                                },
                                "parent": 7,
                                "productBlockInstanceValues": [
                                ],
                                "subscriptionInstanceId": "a05d89ad-9300-4a05-b7f7-0a8d78dd2a07",
                                "inUseByRelations": [
                                ],
                                "icon": "",
                                "label": "SP 10G tagged (ah001a-jnx-test-floris-1-vtb)",
                                "children": [
                                    {
                                        "id": 9,
                                        "subscription": {
                                            "subscriptionId": "00e4fbbb-9192-4fac-9066-5d1381c5f0a4",
                                            "description": "Node ah001a-jnx-test-floris-1-vtb Ah001A"
                                        },
                                        "parent": 8,
                                        "productBlockInstanceValues": [
                                        ],
                                        "subscriptionInstanceId": "6ff2d010-9e16-44ed-ac62-b36b9438c7ff",
                                        "inUseByRelations": [
                                        ],
                                        "icon": "tokenConstant",
                                        "label": "Node ah001a-jnx-test-floris-1-vtb",
                                        "children": [],
                                        "isOutsideCurrentSubscription": true
                                    }
                                ],
                                "isOutsideCurrentSubscription": true
                            }
                        ],
                        "isOutsideCurrentSubscription": false
                    }
                ],
                "isOutsideCurrentSubscription": false
            },
            {
                "id": 1,
                "subscription": {
                    "subscriptionId": "556facd3-6399-4c76-aeb1-114849da2f96",
                    "description": "AMPATH L3VPN AH001A 215 Mbit/s"
                },
                "parent": 0,
                "productBlockInstanceValues": [
                ],
                "subscriptionInstanceId": "43fc68ff-8644-46b1-9e8f-bb4bb46608b9",
                "inUseByRelations": [
                ],
                "icon": "tokenConstant",
                "label": "L3VPNSS AS1105",
                "children": [],
                "isOutsideCurrentSubscription": false
            }
        ],
        "isOutsideCurrentSubscription": false
    }`;

    const tree = JSON.parse(json) as TreeBlock;

    it('should return 1 for the root node', () => {
        const rootDepth = getPositionInTree(tree, 0);
        expect(rootDepth).toBe(1);
    });

    it('should return 2 for the first node', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 2);
        expect(positionOfFirstLevelChild).toBe(2);
    });

    it('should return correct node at position 3', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 3);
        expect(positionOfFirstLevelChild).toBe(3);
    });

    it('should return correct node at position 4', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 4);
        expect(positionOfFirstLevelChild).toBe(4);
    });

    it('should return correct node at position 5', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 5);
        expect(positionOfFirstLevelChild).toBe(5);
    });

    it('should return correct node at position 6', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 6);
        expect(positionOfFirstLevelChild).toBe(6);
    });

    it('should return correct node at position 7', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 7);
        expect(positionOfFirstLevelChild).toBe(7);
    });

    it('should return correct node at position 8', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 8);
        expect(positionOfFirstLevelChild).toBe(8);
    });

    it('should return correct node at position 9', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 9);
        expect(positionOfFirstLevelChild).toBe(9);
    });

    it('should return correct node at position 10', () => {
        const positionOfFirstLevelChild = getPositionInTree(tree, 1);
        expect(positionOfFirstLevelChild).toBe(10);
    });

    it('should return undefined if the id is not found', () => {
        const positionOfUndefined = getPositionInTree(tree, 9999);
        expect(positionOfUndefined).toBeUndefined();
    });
});
