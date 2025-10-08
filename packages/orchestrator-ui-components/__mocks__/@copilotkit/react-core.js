/* global module, jest */
module.exports = {
    useCoAgent: jest.fn(() => ({
        isLoading: false,
        error: null,
        run: jest.fn(),
        result: null,
    })),
};
