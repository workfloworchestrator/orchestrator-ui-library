import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const contentCellStyle = {
        padding: (theme.base / 4) * 3,
        borderBottom: theme.border.thin,
    };

    const headerCellStyle = css({
        ...contentCellStyle,
        paddingLeft: 0,
        width: theme.base * 16,
        fontWeight: theme.font.weight.medium,
    });

    const emptyCellStyle = css({
        width: theme.base,
    });

    const tableStyle = css({
        backgroundColor: theme.colors.lightestShade,
        width: '100%',
        borderRadius: theme.border.radius.medium,
        marginTop: theme.base / 2,
    });

    const timeLineStyle = css({
        paddingLeft: theme.base / 2,
    });
    const workflowTargetStyle = css({ fontWeight: theme.font.weight.bold });

    const lastContentCellStyle = css({
        ...contentCellStyle,
        border: 0,
    });

    const lastHeaderCellStyle = css({
        padding: theme.base,
        paddingLeft: 0,
        width: 250,
        fontWeight: theme.font.weight.medium,
        border: 0,
    });

    const inUseByRelationDetailsStyle = css({
        borderColor: theme.colors.lightShade,
        borderStyle: 'solid',
        borderWidth: 'thin',
        marginBottom: theme.base / 4,
        borderRadius: theme.border.radius.medium,
    });

    return {
        contentCellStyle,
        headerCellStyle,
        tableStyle,
        timeLineStyle,
        workflowTargetStyle,
        emptyCellStyle,
        lastContentCellStyle,
        lastHeaderCellStyle,
        inUseByRelationDetailsStyle,
    };
};
