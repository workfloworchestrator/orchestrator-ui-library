import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getSubscriptionDetailStyles = ({ theme }: WfoTheme) => {
    const productBlockTreeWidth = theme.base * 28;

    const labelCellStyle = css({
        marginLeft: theme.size.m,
    });

    const cellGroupStyle = css({
        paddingBlock: theme.size.m,
    });

    const borderStyle = css({
        borderBottom: theme.border.thin,
    });

    const rowStyle = css({
        paddingInline: theme.size.m,
        '&:last-of-type .border': {
            borderBottom: 'none',
        },
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
        rowStyle,
        labelCellStyle,
        cellGroupStyle,
        borderStyle,
        tableStyle,
        timeLineStyle,
        workflowTargetStyle,
        inUseByRelationDetailsStyle,
        productBlockTreeWidth,
        customerDescriptionsCustomerNameStyle,
        customerDescriptionsFormStyle,
    };
};
