import { getQueryVariablesForExport } from './getQueryVariablesForExport';

describe('getQueryVariablesForExport', () => {
    it('returns queryVariables with first and after property set to 1000 and 0', () => {
        const queryVariables = {
            first: 10,
            after: 20,
            otherField: 'test',
        };

        const result = getQueryVariablesForExport(queryVariables);

        expect(result).toEqual({
            first: 1000,
            after: 0,
            otherField: 'test',
        });
    });
});
