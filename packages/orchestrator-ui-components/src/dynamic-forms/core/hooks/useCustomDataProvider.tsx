const useCustomDataProvider = (cacheKey: number, promiseFn?: () => unknown) => {
    console.log(cacheKey, promiseFn);
    return {
        data: {
            custom1: 'custom1',
            custom2: 'custome2',
        },
        isLoading: false,
        isError: false,
    };
};

export default useCustomDataProvider;
