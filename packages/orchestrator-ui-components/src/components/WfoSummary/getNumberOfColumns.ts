export const getNumberOfColumns = (currentBreakpoint: string | undefined) => {
    switch (currentBreakpoint) {
        case 'xl':
            return 3;
        case 'l':
            return 2;
        case 'm':
        case 's':
        case 'xs':
        default:
            return 1;
    }
};
