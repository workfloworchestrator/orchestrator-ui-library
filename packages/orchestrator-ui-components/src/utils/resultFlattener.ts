import { GraphQlSinglePage } from '@/types';

export const getConcatenatedPagedResult = <T>(
    pagedResult: GraphQlSinglePage<T>,
    fields: Array<keyof T>,
): string => {
    const results = pagedResult.page || [];
    return getConcatenatedResult(results, fields);
};

export const getConcatenatedResult = <T>(
    results: T[],
    fields: Array<keyof T>,
): string => {
    return results.reduce((accumulator, result, index) => {
        const resultFields = fields.reduce((accumulator, field, index) => {
            return (
                accumulator +
                `${result[field]}${index !== fields.length - 1 ? ': ' : ''}`
            );
        }, '');

        return `${accumulator}${resultFields}${
            index !== results.length - 1 ? ' - ' : ''
        }`;
    }, '');
};
