import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';

export const getStyles = (theme: EuiThemeComputed) => {
    const expandIconContainerStyle = {
        cursor: 'pointer',
    };

    const treeContainerStyle = {
        width: 0,
        marginTop: theme.size.s,
        marginRight: `-${theme.size.s}`,
    };

    return {
        expandIconContainerStyle: expandIconContainerStyle,
        treeContainerStyle: treeContainerStyle,
    };
};
