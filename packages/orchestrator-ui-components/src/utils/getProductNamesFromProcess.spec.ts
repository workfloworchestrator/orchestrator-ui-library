import { getProductNamesFromProcess } from './getProductNamesFromProcess';
import { ProcessDetail, StepStatus, ProcessStatus } from '../types';

const getProcessDetail = (data: Partial<ProcessDetail> = {}): ProcessDetail => {
    return {
        processId: 'processId',
        createdBy: 'createdBy',
        started: 'started',
        status: ProcessStatus.CREATED,
        lastStep: 'lastStep',
        lastModified: 'lastModified',
        step: 'step',
        workflowName: 'workflowName',
        steps: [
            {
                name: 'step name',
                status: StepStatus.RUNNING,
                stepid: 'step id',
                executed: 'executed',
                state: '',
            },
        ],
        subscriptions: {
            page: [
                {
                    product: { name: 'productName' },
                    subscriptionId: 'id',
                    description: 'description',
                },
            ],
        },
        customer: 'customer',
        ...data,
    };
};

describe('getProductNamesFromProcess()', () => {
    it('returns empty string when process has no subscriptions', () => {
        const result = getProductNamesFromProcess(
            getProcessDetail({ subscriptions: undefined }),
        );
        expect(result).toEqual('');
    });
    it('returns 1 productName when process has 1 subscriptions', () => {
        const result = getProductNamesFromProcess(
            getProcessDetail({
                subscriptions: {
                    page: [
                        {
                            product: { name: 'TEST NAME' },
                            subscriptionId: 'id',
                            description: 'description',
                        },
                    ],
                },
            }),
        );
        expect(result).toEqual('TEST NAME');
    });

    it('returns 2 productNames concatenated when process has 2 subscriptions with different products', () => {
        const result = getProductNamesFromProcess(
            getProcessDetail({
                subscriptions: {
                    page: [
                        {
                            product: { name: 'TEST NAME' },
                            subscriptionId: 'id',
                            description: 'description',
                        },
                        {
                            product: { name: 'TEST NAME 2' },
                            subscriptionId: 'id',
                            description: 'description',
                        },
                    ],
                },
            }),
        );
        expect(result).toEqual('TEST NAME, TEST NAME 2');
    });
    it('returns 1 productName when process has 2 subscriptions with same products', () => {
        const result = getProductNamesFromProcess(
            getProcessDetail({
                subscriptions: {
                    page: [
                        {
                            product: { name: 'TEST NAME' },
                            subscriptionId: 'id',
                            description: 'description',
                        },
                        {
                            product: { name: 'TEST NAME' },
                            subscriptionId: 'id',
                            description: 'description',
                        },
                    ],
                },
            }),
        );
        expect(result).toEqual('TEST NAME');
    });

    it('returns correct string when process has these subscriptions', () => {
        const result = getProductNamesFromProcess(
            getProcessDetail({
                subscriptions: {
                    page: [
                        {
                            product: { name: 'TEST NAME' },
                            subscriptionId: 'id',
                            description: 'description',
                        },
                        {
                            product: { name: 'TEST NAME' },
                            subscriptionId: 'id',
                            description: 'description',
                        },
                        {
                            product: { name: 'TEST NAME 2' },
                            subscriptionId: 'id',
                            description: 'description',
                        },
                    ],
                },
            }),
        );
        expect(result).toEqual('TEST NAME, TEST NAME 2');
    });
});
