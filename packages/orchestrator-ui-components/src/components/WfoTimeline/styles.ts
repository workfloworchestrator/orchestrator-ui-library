import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';
import { StepStatus } from '@/types';

import { TimelinePosition } from './WfoTimeline';

export const getTimelineStyles = ({ theme }: WfoTheme) => {
    const TIMELINE_HEIGHT = theme.base * 2.5;
    const TIMELINE_OUTLINE_WIDTH = theme.base * 0.75;

    const timelineHeightPx = `${TIMELINE_HEIGHT}px`;
    const timelineOutlineWidthPx = `${TIMELINE_OUTLINE_WIDTH}px`;
    const emptyStepOuterDiameter = theme.base;
    const emptyStepInnerDiameter = theme.base / 2;
    const stepWithValueOuterDiameter = theme.base * 1.5;
    const stepWithValueInnerDiameter = theme.base;
    const minimalLineLengthBetweenSteps = theme.base / 2;

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

    const getTextColorForStepStatusIcon = (processStepStatus: StepStatus) => {
        switch (processStepStatus) {
            case StepStatus.SUSPEND:
                return theme.colors.ink;
            default:
                return theme.colors.ghost;
        }
    };

    const timelinePanelStyle = css({
        backgroundColor: theme.colors.body,
        borderRadius: theme.border.radius.medium,
        outline: `${timelineOutlineWidthPx} solid ${theme.colors.emptyShade}`,
        height: timelineHeightPx,
        marginTop: timelineOutlineWidthPx,
        marginBottom: timelineOutlineWidthPx,
        overflow: 'auto',
        scrollbarWidth: 'auto',
        paddingTop: theme.font.baseline * 2,
        paddingBottom: theme.font.baseline * 2,
        paddingLeft: theme.font.baseline * 4,
        paddingRight: theme.font.baseline * 4,
        position: 'sticky',
        top: timelineOutlineWidthPx,
        zIndex: 2, // Some EUI components have a zIndex
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
            minWidth: minimalLineLengthBetweenSteps,
        });

    const getStepLineStyle = (
        timelinePosition: TimelinePosition,
        isFirstStep: boolean,
        isLastStep: boolean,
    ) => {
        const getBeforeLineColor = (timelinePosition: TimelinePosition) => {
            switch (timelinePosition) {
                case TimelinePosition.PAST:
                case TimelinePosition.CURRENT:
                    return theme.colors.primary;
                case TimelinePosition.FUTURE:
                default:
                    return theme.colors.lightShade;
            }
        };

        const getAfterLineColor = (timelinePosition: TimelinePosition) => {
            switch (timelinePosition) {
                case TimelinePosition.PAST:
                    return theme.colors.primary;
                case TimelinePosition.CURRENT:
                case TimelinePosition.FUTURE:
                default:
                    return theme.colors.lightShade;
            }
        };

        return css([
            !isFirstStep && {
                '::before': {
                    ...getHorizontalLineStyle(
                        getBeforeLineColor(timelinePosition),
                    ),
                },
            },
            !isLastStep && {
                '::after': {
                    ...getHorizontalLineStyle(
                        getAfterLineColor(timelinePosition),
                    ),
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
            color: getTextColorForStepStatusIcon(stepStatus),
        });
    };

    const stepStyle = css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    });

    const clickableStyle = css({
        cursor: 'pointer',
    });

    const notClickableStyle = css({
        cursor: 'auto',
    });

    return {
        TIMELINE_HEIGHT,
        TIMELINE_OUTLINE_WIDTH,
        timelinePanelStyle,
        stepStyle,
        clickableStyle,
        notClickableStyle,
        getStepLineStyle,
        getStepOuterCircleStyle,
        getStepInnerCircleStyle,
    };
};
