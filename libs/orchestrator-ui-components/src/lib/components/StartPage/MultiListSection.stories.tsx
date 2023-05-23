import type { Meta } from '@storybook/react';
import { MultiListSection } from './MultiListSection';

const subscriptionsList = [
    {
        name: 'test subscription 1',
        subscription_id: '8993297c-1bc6-4acf-aec1-056e75edabc0',
        description: 'test description',
        product: { name: 'test product' },
    },
    {
        name: 'test subscription 2',
        subscription_id: 'a3656039-9c5c-4bb8-8c1a-b86e983aac9a',
        description: 'test description',
        product: { name: 'test product' },
    },
    {
        name: 'test subscription 3',
        subscription_id: '226dc515-82d0-475a-94f6-e8c1c8b37054',
        description: 'test description',
        product: { name: 'test product 2' },
    },
    {
        name: 'test subscription 4',
        subscription_id: 'd8d962ce-36a7-4bdc-b567-6ece33741c90',
        description: 'test description',
        product: { name: 'test product 3' },
    },
    {
        name: 'test subscription 5',
        subscription_id: 'ed5ba88d-7639-462a-9b81-bcc36064002f',
        description: 'test description',
        product: { name: 'test product 3' },
    },
];

const processesList = [
    {
        workflow: 'test_workflow_1',
        subscription_id: '1234597c-1bc6-4acf-aec1-056e75edabc0',
        last_modified_at: 1678829904.344238,
    },
    {
        workflow: 'test_workflow_2',
        subscription_id: '069504de-01e0-4cc2-a59a-098c441ac3bd',
        last_modified_at: 1678889904.344238,
    },
    {
        workflow: 'test_workflow_1',
        subscription_id: 'aa1ef8a5-bf27-4204-b8c9-8e703a6102a2',
        last_modified_at: 1678929904.344238,
    },
    {
        workflow: 'test_workflow_4',
        subscription_id: '583da7c2-332e-457e-b593-3a2756c2c5bd',
        last_modified_at: 1678999904.344238,
    },
    {
        workflow: 'test_workflow_2',
        subscription_id: 'f96e7fff-22b0-471f-a5aa-18e04252799d',
        last_modified_at: 1679199904.344238,
    },
];

const Story: Meta<typeof MultiListSection> = {
    component: MultiListSection,
    title: 'StartPage/MultiListSection',
    parameters: {
        mockData: [
            {
                url: 'https://testing.test//subscriptions/?range=10%2C15',
                method: 'GET',
                status: 200,
                response: subscriptionsList,
            },
            {
                url: 'https://testing.test//processes/?range=106-111',
                method: 'GET',
                status: 200,
                response: processesList,
            },
        ],
    },
};
export default Story;

export const Primary = {
    args: {},
};
