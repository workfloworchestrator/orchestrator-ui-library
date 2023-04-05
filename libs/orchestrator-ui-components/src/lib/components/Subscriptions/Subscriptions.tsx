import { Table } from './Table';
import { EuiDataGridColumn } from '@elastic/eui';

export type TestData = {
    defaultKey: string;
    booleanKey: boolean;
    numericKey: string;
    currencyKey: string;
    datetimeKey: Date;
    customKey: string;
};

export const Subscriptions = () => {
    // id is any key of TestData
    const columns: EuiDataGridColumn[] = [
        {
            id: 'defaultKey',
            displayAsText: 'Default Key',
        },
        {
            id: 'booleanKey',
        },
        {
            id: 'numericKey',
        },
        {
            id: 'currencyKey',
        },
        {
            id: 'datetimeKey',
            schema: 'datetime',
        },
        {
            id: 'customKey',
            schema: 'favoriteFranchise',
        },
    ];
    const testData: TestData[] = generateTestData();

    return <Table tableData={testData} tableColumns={columns}></Table>;
};

// ------------------------------- TestData ----------------------------------- //
// https://codesandbox.io/s/boring-burnell-s3mvuh

function generateTestData() {
    const storeData: TestData[] = [];
    for (let i = 1; i < 5; i++) {
        const data: TestData = {
            defaultKey: 'defaultValue',
            booleanKey: true,
            numericKey: '123',
            currencyKey: '10',
            datetimeKey: new Date(),
            customKey: i % 2 === 0 ? 'Star Wars' : 'Star Trek',
        };
        storeData.push(data);
    }

    return storeData;
}
