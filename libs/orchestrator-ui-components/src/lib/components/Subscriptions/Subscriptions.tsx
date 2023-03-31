import 'regenerator-runtime/runtime';
import { EuiDataGrid, EuiDataGridColumn } from '@elastic/eui';
import { useState } from 'react';

export const Subscriptions = () => {
    const columns: EuiDataGridColumn[] = [
        {
            id: 'defaultKey',
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

    const [visibleColumns, setVisibleColumns] = useState(
        columns.map(({ id }) => id),
    );

    const testData: TestData[] = generateTestData();

    return (
        <>
            <h1>Hello subscriptions</h1>
            <EuiDataGrid
                aria-label="Data Grid"
                columns={columns}
                columnVisibility={{ visibleColumns, setVisibleColumns }}
                rowCount={testData.length}
                renderCellValue={({ rowIndex, columnId, schema }) => (
                    <h1>Hahaha</h1>
                )}
            />
        </>
    );
};

// ------------------------------- TestData ----------------------------------- //
// https://codesandbox.io/s/boring-burnell-s3mvuh

type TestData = {
    defaultKey: string;
    booleanKey: boolean;
    numericKey: string;
    currencyKey: string;
    datetimeKey: Date;
    customKey: string;
};

function generateTestData() {
    const storeData: TestData[] = [];
    for (let i = 1; i < 5; i++) {
        storeData.push({
            defaultKey: 'defaultValue',
            booleanKey: true,
            numericKey: '123',
            currencyKey: '10',
            datetimeKey: new Date(),
            customKey: i % 2 === 0 ? 'Star Wars' : 'Star Trek',
        });
    }

    return storeData;
}
