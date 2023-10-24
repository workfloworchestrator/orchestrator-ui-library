import { TimelinePosition } from './WFOTimeline';

export const getTimelinePosition = (
    index: number,
    indexOfCurrentStep: number,
) => {
    if (index === indexOfCurrentStep) {
        return TimelinePosition.CURRENT;
    }

    return index < indexOfCurrentStep
        ? TimelinePosition.PAST
        : TimelinePosition.FUTURE;
};
