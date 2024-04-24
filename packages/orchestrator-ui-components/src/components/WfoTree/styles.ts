import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
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
