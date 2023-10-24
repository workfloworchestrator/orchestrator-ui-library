import { WfoProcessListTabType } from './tabConfig';

export const getProcessListTabTypeFromString = (
    tabId?: string,
): WfoProcessListTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case WfoProcessListTabType.ACTIVE.toString():
            return WfoProcessListTabType.ACTIVE;
        case WfoProcessListTabType.COMPLETED.toString():
            return WfoProcessListTabType.COMPLETED;

        default:
            return undefined;
    }
};
