import { StepState } from '../types';

export const stateDelta = (previous: StepState, current: StepState) => {
    const previousOrEmpty = previous ?? {};
    const prevKeys = Object.keys(previousOrEmpty);
    const currKeys = Object.keys(current);
    const newKeys = currKeys.filter(
        (key) =>
            prevKeys.indexOf(key) === -1 ||
            JSON.stringify(previousOrEmpty[key]) !==
                JSON.stringify(current[key]),
    );

    return newKeys.sort().reduce((acc: StepState, key) => {
        if (
            current[key] === Object(current[key]) &&
            !Array.isArray(current[key]) &&
            previousOrEmpty[key]
        ) {
            acc[key] = stateDelta(
                previousOrEmpty[key] as StepState,
                current[key] as StepState,
            );
        } else {
            acc[key] = current[key];
        }
        return acc;
    }, {});
};
