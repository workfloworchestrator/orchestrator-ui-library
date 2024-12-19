import { getQueryUrl } from './getQueryUrl';

describe('getQueryUrl', () => {
    it('returns a url with the specified query', () => {
        const result = getQueryUrl('/sample-page/sub-page', 'testQuery');

        expect(result).toEqual('/sample-page/sub-page?queryString=testQuery');
    });
});
