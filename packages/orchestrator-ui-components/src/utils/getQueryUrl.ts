import { DataDisplayParams } from '@/hooks';

export const getQueryUrl = (pageUrl: string, queryString: string) => {
    // Prevents silently breaking functionality when the DataDisplayParams type changes
    const queryKey: keyof DataDisplayParams<object> = 'queryString';

    return `${pageUrl}?${queryKey}=${queryString}`;
};
