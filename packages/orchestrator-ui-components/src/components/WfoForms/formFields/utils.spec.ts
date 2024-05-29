import type { ProductBlockInstance, SubscriptionDetail } from '@/types';

import {
    ProcessStatus,
    ProductLifecycleStatus,
    SubscriptionStatus,
    WorkflowTarget,
} from '../../../types';
import { ProductTag } from './deprecated/types';
import {
    getPortMode,
    subscriptionHasTaggedPortModeInstanceValue,
    subscriptionHasTaggedProduct,
} from './utils';

const getProductBlockInstance = (
    instanceProperties: Partial<ProductBlockInstance> = {},
): ProductBlockInstance => ({
    id: 1,
    parent: 0,
    productBlockInstanceValues: [],
    subscriptionInstanceId: 'testId',
    inUseByRelations: [],
    subscription: {
        subscriptionId: 'OwnerSubscriptionId',
        description: 'OwnerSubscription description',
    },
    ...instanceProperties,
});

const testProductBlockInstances: ProductBlockInstance[] = [
    getProductBlockInstance(),
];

const testSubscriptionDetail: SubscriptionDetail = {
    subscriptionId: 'testId',
    description: 'test description',
    insync: false,
    note: 'test note',
    fixedInputs: [],
    product: {
        productId: 'testId',
        createdAt: '999-09-09',
        name: 'Test product name',
        status: ProductLifecycleStatus.ACTIVE,
        description: 'Test product description',
        tag: '',
        productType: 'testType',
        endDate: '2222-02-02',
    },
    endDate: '2222-02-02',
    startDate: '1111-01-01',
    status: SubscriptionStatus.ACTIVE,
    productBlockInstances: testProductBlockInstances,
    metadata: {},
    customerDescriptions: [],
    processes: {
        page: [
            {
                processId: 'Test process id',
                lastStatus: ProcessStatus.ABORTED,
                startedAt: '1111-01-01',
                createdBy: 'Test',
                workflowTarget: WorkflowTarget.CREATE,
                workflowName: 'Test workflow name',
                isTask: false,
            },
        ],
    },
};

describe('formField utils', () => {
    describe('getPortMode()', () => {
        it('returns undefined if the productBlockInstances is an empty array', () => {
            const result = getPortMode([]);
            expect(result).toEqual(undefined);
        });

        it('returns undefined if the productBlockInstances dont contain a productBlockInstanceValues', () => {
            const result = getPortMode([
                getProductBlockInstance({
                    productBlockInstanceValues: [
                        {
                            field: 'key1',
                            value: 'value1',
                        },
                    ],
                }),
            ]);
            expect(result).toEqual(undefined);
        });

        it('returns undefined if the productBlockInstances dont contain productBlockInstanceValues but none with portMode', () => {
            const result = getPortMode([
                getProductBlockInstance({
                    productBlockInstanceValues: [
                        {
                            field: 'portMode',
                            value: 'NOTTAGGED',
                        },
                    ],
                }),
            ]);
            expect(result).toEqual('NOTTAGGED');
        });

        it('returns the first portMode if there are more than one productBlockInstanceValue with portmode', () => {
            const result = getPortMode([
                getProductBlockInstance({
                    productBlockInstanceValues: [
                        {
                            field: 'portMode',
                            value: 'FIRST',
                        },
                    ],
                }),
                getProductBlockInstance({
                    productBlockInstanceValues: [
                        {
                            field: 'portMode',
                            value: 'SECOND',
                        },
                    ],
                }),
            ]);
            expect(result).toEqual('FIRST');
        });

        it('returns undefined if the productBlockInstances dont contain a portMode field', () => {
            const result = getPortMode([
                ...testProductBlockInstances,
                {
                    id: 1,
                    parent: 0,
                    productBlockInstanceValues: [],
                    subscriptionInstanceId: 'testId',
                    inUseByRelations: [],
                    subscription: {
                        subscriptionId: 'OwnerSubscriptionId',
                        description: 'OwnerSubscription description',
                    },
                },
            ]);
            expect(result).toEqual(undefined);
        });
    });

    describe('subscriptionHasPortModeInstanceValue()', () => {
        it('returns false if the subscriptionDetail has no productBlockInstances', () => {
            const result = subscriptionHasTaggedPortModeInstanceValue(
                testSubscriptionDetail,
            );
            expect(result).toEqual(false);
        });
        it('returns false if the subscriptionDetail has no productBlockInstances with no productBlockInstanceValues', () => {
            const subscriptionDetail: SubscriptionDetail = {
                ...testSubscriptionDetail,
                productBlockInstances: [
                    {
                        id: 1,
                        parent: 0,
                        productBlockInstanceValues: [],
                        subscriptionInstanceId: 'testId',
                        inUseByRelations: [],
                        subscription: {
                            subscriptionId: 'OwnerSubscriptionId 1',
                            description: 'OwnerSubscriptionId description',
                        },
                    },
                ],
            };
            const result =
                subscriptionHasTaggedPortModeInstanceValue(subscriptionDetail);
            expect(result).toEqual(false);
        });

        it('returns false if the subscriptionDetail has no productBlockInstances with productBlockInstanceValues but not with portMode', () => {
            const subscriptionDetail: SubscriptionDetail = {
                ...testSubscriptionDetail,
                productBlockInstances: [
                    {
                        id: 1,
                        parent: 0,
                        subscriptionInstanceId: 'testId',
                        inUseByRelations: [],
                        subscription: {
                            subscriptionId: 'OwnerSubscriptionId 1',
                            description: 'OwnerSubscriptionId description',
                        },
                        productBlockInstanceValues: [
                            {
                                field: 'key1',
                                value: 'value1',
                            },
                            {
                                field: 'key2',
                                value: 'value2',
                            },
                        ],
                    },
                ],
            };
            const result =
                subscriptionHasTaggedPortModeInstanceValue(subscriptionDetail);
            expect(result).toEqual(false);
        });
        it('returns false if the subscriptionDetail has no productBlockInstances with productBlockInstanceValues with portMode and value not tagged', () => {
            const subscriptionDetail: SubscriptionDetail = {
                ...testSubscriptionDetail,
                productBlockInstances: [
                    {
                        id: 1,
                        parent: 0,
                        subscriptionInstanceId: 'testId',
                        inUseByRelations: [],
                        subscription: {
                            subscriptionId: 'OwnerSubscriptionId 1',
                            description: 'OwnerSubscriptionId description',
                        },
                        productBlockInstanceValues: [
                            {
                                field: 'key1',
                                value: 'value1',
                            },
                            {
                                field: 'portMode',
                                value: 'NOTTAGGED',
                            },
                        ],
                    },
                ],
            };
            const result =
                subscriptionHasTaggedPortModeInstanceValue(subscriptionDetail);
            expect(result).toEqual(false);
        });
        it('returns true if the subscriptionDetail has productBlockInstances with productBlockInstanceValues with field portMode and value = tagged', () => {
            const subscriptionDetail: SubscriptionDetail = {
                ...testSubscriptionDetail,
                productBlockInstances: [
                    {
                        id: 1,
                        parent: 0,
                        subscriptionInstanceId: 'testId',
                        inUseByRelations: [],
                        subscription: {
                            subscriptionId: 'OwnerSubscriptionId 1',
                            description: 'OwnerSubscriptionId description',
                        },
                        productBlockInstanceValues: [
                            {
                                field: 'key1',
                                value: 'value1',
                            },
                            {
                                field: 'portMode',
                                value: 'tagged',
                            },
                        ],
                    },
                ],
            };
            const result =
                subscriptionHasTaggedPortModeInstanceValue(subscriptionDetail);
            expect(result).toEqual(true);
        });
    });
    describe('subscriptionHasTaggedProduct()', () => {
        it('returns false if the subscriptionDetail.product.tag is undefined', () => {
            const result = subscriptionHasTaggedProduct(testSubscriptionDetail);
            expect(result).toEqual(false);
        });
        it('returns false if the subscriptionDetail.product.tag is not a tagged product', () => {
            const subscriptionDetailTest: SubscriptionDetail = {
                ...testSubscriptionDetail,
                product: {
                    ...testSubscriptionDetail.product,
                    tag: 'RANDOMTAG',
                },
            };
            const result = subscriptionHasTaggedProduct(subscriptionDetailTest);
            expect(result).toEqual(false);
        });
        it('returns true if the subscriptionDetail.product.tag is a tagged product', () => {
            const subscriptionDetailTest: SubscriptionDetail = {
                ...testSubscriptionDetail,
                product: {
                    ...testSubscriptionDetail.product,
                    tag: ProductTag.MSC,
                },
            };
            const result = subscriptionHasTaggedProduct(subscriptionDetailTest);
            expect(result).toEqual(true);
        });
    });
});
