import { ProcessDetail } from '../types';

export const getProductNamesFromProcess = (
    process: ProcessDetail | undefined | Omit<ProcessDetail, 'status'>,
): string => {
    if (!process) return '';

    const productNames: string[] =
        process && process.subscriptions && process.subscriptions.page
            ? process.subscriptions.page.map((page) => page.product.name)
            : [];

    return productNames
        .filter((name, index) => productNames.indexOf(name) === index)
        .join(', ');
};
