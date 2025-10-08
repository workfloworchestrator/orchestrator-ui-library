import { TimelinePosition } from './WfoTimeline';

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
