import { css } from '@emotion/react';
import { WfoTheme } from '@orchestrator-ui/orchestrator-ui-components';

export const getWfoGroupedTableStyles = ({ theme }: WfoTheme) => {
    // Matches the default width of a EuiButtonIcon component
    const expandRowButtonWidth = '24px';
    const marginBetweenButtonAndGroupLabel = theme.size.m;

    const innerTableHeaderStyle = css({
        fontSize: theme.size.m,
        textAlign: 'left',
        backgroundColor: theme.colors.lightestShade,
    });

    const expandableRowContainerStyle = css({
        display: 'flex',
        alignItems: 'center',
    });

    const expandableRowTextStyle = css({
        marginLeft: marginBetweenButtonAndGroupLabel,
        fontWeight: theme.font.weight.medium,
    });

    const getNestingStyle = (nestingLevel: number) =>
        css({
            'th:first-child > *:first-child, td:first-child > *:first-child': {
                marginLeft: `calc(${nestingLevel} * (${expandRowButtonWidth} + ${marginBetweenButtonAndGroupLabel}))`,
            },
        });

    return {
        innerTableHeaderStyle,
        expandableRowContainerStyle,
        expandableRowTextStyle,
        getNestingStyle,
    };
};
