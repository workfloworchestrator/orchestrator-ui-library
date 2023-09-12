import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';
import { StepStatus } from '../../../types';
import { TimelinePosition } from './WFOTimeline';

export const getStyles = (theme: EuiThemeComputed) => {
    const emptyStepOuterDiameter = theme.base;
    const emptyStepInnerDiameter = theme.base / 2;

    const stepWithValueOuterDiameter = theme.base * 1.5;
    const stepWithValueInnerDiameter = theme.base;

    const getColorForStepStatus = (processStepStatus: StepStatus) => {
        switch (processStepStatus) {
            case StepStatus.SUSPEND:
                return theme.colors.warning;
            case StepStatus.FAILED:
                return theme.colors.danger;

            case StepStatus.SUCCESS:
            case StepStatus.SKIPPED:
            case StepStatus.COMPLETE:
                return theme.colors.primary;
            case StepStatus.RUNNING:
            case StepStatus.PENDING:
            default:
                return theme.colors.mediumShade;
        }
    };

    const timelinePanelStyle = css({
        backgroundColor: theme.colors.body,
        borderRadius: theme.border.radius.medium,
        overflow: 'auto',
        scrollbarWidth: 'auto',
        paddingTop: theme.font.baseline * 2,
        paddingBottom: theme.font.baseline * 2,
        paddingLeft: theme.font.baseline * 10,
        paddingRight: theme.font.baseline * 10,
        display: 'flex',

        '& > button': {
            flexGrow: 2,
        },
        '& > button:first-child, & > button:last-child': {
            flexGrow: 1,
        },
    });

    const getHorizontalLineStyle = (color: string) =>
        css({
            content: '""',
            height: theme.border.width.thick,
            backgroundColor: color,
            flexGrow: 1,
            minWidth: emptyStepOuterDiameter / 2,
        });

    const getStepLineStyle = (
        timelinePosition: TimelinePosition,
        isFirstStep: boolean,
        isLastStep: boolean,
    ) => {
        const getBeforeColor = (timelinePosition: TimelinePosition) => {
            switch (timelinePosition) {
                case TimelinePosition.PAST:
                case TimelinePosition.CURRENT:
                    return theme.colors.primary;
                case TimelinePosition.FUTURE:
                    return theme.colors.lightShade;
            }
        };

        const getAfterColor = (timelinePosition: TimelinePosition) => {
            switch (timelinePosition) {
                case TimelinePosition.PAST:
                    return theme.colors.primary;
                case TimelinePosition.CURRENT:
                case TimelinePosition.FUTURE:
                    return theme.colors.lightShade;
            }
        };

        return css([
            !isFirstStep && {
                '::before': {
                    ...getHorizontalLineStyle(getBeforeColor(timelinePosition)),
                },
            },
            !isLastStep && {
                '::after': {
                    ...getHorizontalLineStyle(getAfterColor(timelinePosition)),
                },
            },
        ]);
    };

    const getStepOuterCircleStyle = (hasContent: boolean) =>
        css({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            backgroundColor: theme.colors.emptyShade,
            height: hasContent
                ? stepWithValueOuterDiameter
                : emptyStepOuterDiameter,
            width: hasContent
                ? stepWithValueOuterDiameter
                : emptyStepOuterDiameter,
        });

    const getStepInnerCircleStyle = (
        stepStatus: StepStatus,
        hasContent: boolean,
    ) => {
        const diameter = hasContent
            ? stepWithValueInnerDiameter
            : emptyStepInnerDiameter;

        return css({
            borderRadius: '50%',
            backgroundColor: getColorForStepStatus(stepStatus),
            height: diameter,
            width: diameter,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white', // todo determine final color
        });
    };

    const stepStyle = css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    });

    return {
        timelinePanelStyle,
        stepStyle,
        getStepLineStyle,
        stepOuterCircleStyle: getStepOuterCircleStyle,
        getStepInnerCircleStyle,
    };
};
