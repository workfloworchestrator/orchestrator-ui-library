import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getSubscriptionDetailStyles = ({ theme }: WfoTheme) => {
    const productBlockTreeWidth = theme.base * 28;

    const contentCellStyle = css({
        padding: (theme.base / 4) * 3,
        borderBottom: theme.border.thin,
        borderBottomColor: theme.colors.lightShade,
    });

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

    const lastContentCellStyle = css([
        {
            ...contentCellStyle,
        },
        {
            borderBottom: 0,
        },
    ]);

    const lastHeaderCellStyle = css([
        {
            ...headerCellStyle,
        },
        {
            borderBottomWidth: 0,
        },
    ]);

    const inUseByRelationDetailsStyle = css({
        borderColor: theme.colors.lightShade,
        borderStyle: 'solid',
        borderWidth: 'thin',
        marginBottom: theme.base / 4,
        borderRadius: theme.border.radius.medium,
    });

    const customerDescriptionsCustomerNameStyle = css({
        whiteSpace: 'nowrap',
        alignSelf: 'center',
        marginRight: theme.base / 2,
    });
    const customerDescriptionsFormStyle = css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
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
        productBlockTreeWidth,
        customerDescriptionsCustomerNameStyle,
        customerDescriptionsFormStyle,
    };
};
