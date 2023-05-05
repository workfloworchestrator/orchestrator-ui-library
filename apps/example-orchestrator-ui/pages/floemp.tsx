import React from 'react';
import { useEuiTheme } from '@elastic/eui';
import { Tree } from '@orchestrator-ui/orchestrator-ui-components';

const DATA = [
    {
        id: '1',
        label: 'Food',
        children: [
            {
                id: '2',
                label: 'Meat',
            },
            {
                id: '3',
                label: 'Salad',
                children: [
                    {
                        id: '4',
                        label: 'Tomatoes',
                    },
                    {
                        id: '5',
                        label: 'Cabbage',
                    },
                ],
            },
        ],
    },
    {
        id: '6',
        label: 'Drinks',
        children: [
            {
                id: '7',
                label: 'Beer',
            },
            {
                id: '8',
                label: 'Soft drink',
            },
        ],
    },
];

export function Index() {
    const { euiTheme } = useEuiTheme();

    return (
        <>
            <Tree data={DATA} />
        </>
    );
}

export default Index;
