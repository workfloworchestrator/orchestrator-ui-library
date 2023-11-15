import type { ProductBlockInstance, SubscriptionDetail } from '../../../types';
import {
    ProcessStatus,
    ProductLifecycleStatus,
    SubscriptionStatus,
    WorkflowTarget,
} from '../../../types';
import {
    subscriptionHasTaggedPortModeInstanceValue,
    subscriptionHasTaggedProduct,
} from './utils';
import { ProductTag } from './types';

const testProductBlockInstances: ProductBlockInstance[] = [
    {
        id: 1,
        ownerSubscriptionId: 'ProductBlockInstanceId 1',
        parent: 0,
        productBlockInstanceValues: [],
        subscriptionInstanceId: 'testId',
        inUseByRelations: [],
    },
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
    processes: {
        page: [
            {
                processId: 'Test process id',
                lastStatus: ProcessStatus.ABORTED,
                startedAt: '1111-01-01',
                createdBy: 'Test',
                workflowTarget: WorkflowTarget.CREATE,
                workflowName: 'Test workflow name',
            },
        ],
    },
};

describe('formField utils', () => {
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
                        ownerSubscriptionId: 'ProductBlockInstanceId 1',
                        parent: 0,
                        productBlockInstanceValues: [],
                        subscriptionInstanceId: 'testId',
                        inUseByRelations: [],
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
                        ownerSubscriptionId: 'ProductBlockInstanceId 1',
                        parent: 0,
                        subscriptionInstanceId: 'testId',
                        inUseByRelations: [],
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
                        ownerSubscriptionId: 'ProductBlockInstanceId 1',
                        parent: 0,
                        subscriptionInstanceId: 'testId',
                        inUseByRelations: [],
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
                        ownerSubscriptionId: 'ProductBlockInstanceId 1',
                        parent: 0,
                        subscriptionInstanceId: 'testId',
                        inUseByRelations: [],
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
