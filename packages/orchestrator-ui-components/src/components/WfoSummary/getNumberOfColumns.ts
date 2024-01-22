export const getNumberOfColumns = (currentBreakpoint: string | undefined) => {
    switch (currentBreakpoint) {
        case 'xxl':
            return 3;
        case 'xl':
            return 2;
        case 'l':
        case 'm':
        case 's':
        case 'xs':
        default:
            return 1;
    }
};
