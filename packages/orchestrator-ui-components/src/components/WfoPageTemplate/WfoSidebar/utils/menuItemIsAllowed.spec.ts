import { menuItemIsAllowed } from './menuItemIsAllowed';

const isAllowedHandlerMock = jest.fn();
const testUrlMap = new Map<string, string>([
    ['/testUrl1', '/testPolicyResource1'],
    ['/testUrl2', '/testPolicyResource2'],
]);

describe('menuItemIsAllowed', () => {
    beforeEach(() => {
        isAllowedHandlerMock.mockClear();
    });

    it('returns true when url is undefined', () => {
        const url = undefined;

        const result = menuItemIsAllowed(url, testUrlMap, isAllowedHandlerMock);

        expect(result).toEqual(true);
        expect(isAllowedHandlerMock).not.toHaveBeenCalled();
    });

    it('returns true when url is an empty string', () => {
        const url = '';

        const result = menuItemIsAllowed(url, testUrlMap, isAllowedHandlerMock);

        expect(result).toEqual(true);
        expect(isAllowedHandlerMock).not.toHaveBeenCalled();
    });

    it('returns the result of the isAllowedHandler when url is in the url-map', () => {
        const url = '/testUrl1';
        isAllowedHandlerMock.mockReturnValue(false);

        const result = menuItemIsAllowed(url, testUrlMap, isAllowedHandlerMock);

        expect(result).toEqual(false);
        expect(isAllowedHandlerMock).toHaveBeenCalledWith(
            '/testPolicyResource1',
        );
    });

    it('returns true url is not in the url-map', () => {
        const url = '/does-not-exist';

        const result = menuItemIsAllowed(url, testUrlMap, isAllowedHandlerMock);

        expect(result).toEqual(true);
        expect(isAllowedHandlerMock).not.toHaveBeenCalled();
    });
});
