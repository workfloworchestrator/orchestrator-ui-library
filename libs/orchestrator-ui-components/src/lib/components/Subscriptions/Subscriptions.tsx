import { Table, TableColumns } from './Table';

export type TestData = {
    defaultKey: string;
    booleanKey: boolean;
    numericKey: string;
    currencyKey: string;
    datetimeKey: Date;
    customKey: string;
};

export const Subscriptions = () => {
    const testDataColumns: TableColumns<TestData> = {
        defaultKey: {
            displayAsText: 'Default key',
        },
        booleanKey: {},
        numericKey: {},
        currencyKey: {},
        datetimeKey: {},
        customKey: {
            schema: 'favoriteFranchise',
        },
    };

    const testData: TestData[] = generateTestData();

    return <Table data={testData} columns={testDataColumns}></Table>;
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
