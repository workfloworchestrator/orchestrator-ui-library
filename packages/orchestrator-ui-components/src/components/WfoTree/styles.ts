import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';

export const getStyles = (theme: EuiThemeComputed) => {
    const expandIconContainer = {
        cursor: 'pointer',
    };

    const treeContainer = {
        width: 0,
        marginTop: theme.size.s,
        marginRight: `-${theme.size.s}`,
    };

    return {
        expandIconContainer,
        treeContainer,
    };
};
