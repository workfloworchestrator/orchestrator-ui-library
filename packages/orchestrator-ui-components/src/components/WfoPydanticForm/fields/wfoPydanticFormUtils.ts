import { capitalize } from 'lodash';

export type SummaryFormLabel =
    | string
    | null
    | undefined
    | Record<string, unknown>;

export const getNestedSummaryLabel = (
    labels: SummaryFormLabel[],
    index: number,
): string => {
    const value = labels[index];
    if (typeof value === 'object' && value !== null) {
        const firstKey: string = Object.keys(value)[0] ?? '';
        return capitalize(firstKey);
    }
    return String(value);
};
