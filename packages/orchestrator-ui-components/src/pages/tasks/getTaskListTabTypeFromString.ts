import { WfoTaskListTabType } from './tabConfig';

export const getTaskListTabTypeFromString = (
    tabId?: string,
): WfoTaskListTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case WfoTaskListTabType.ACTIVE.toString():
            return WfoTaskListTabType.ACTIVE;
        case WfoTaskListTabType.COMPLETED.toString():
            return WfoTaskListTabType.COMPLETED;

        default:
            return undefined;
    }
};
