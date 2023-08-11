import { WFOProcessListTabType } from './tabConfig';

export const getProcessListTabTypeFromString = (
    tabId?: string,
): WFOProcessListTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case WFOProcessListTabType.ACTIVE.toString():
            return WFOProcessListTabType.ACTIVE;
        case WFOProcessListTabType.COMPLETED.toString():
            return WFOProcessListTabType.COMPLETED;

        default:
            return undefined;
    }
};
