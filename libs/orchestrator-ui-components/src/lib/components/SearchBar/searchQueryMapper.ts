import { Value } from '@elastic/eui/src/components/search_bar/query/ast';
import { QueryContainer } from '@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl';

export type FilterQuery = {
    field: string;
    value: string;
};

// Using ts-ignore here, because the properties in QueryContainer are typed as object

// Todo: remove this
export const mapEsQueryContainerToKeyValueTuple = (
    queryContainer: QueryContainer,
): [string, string] | undefined => {
    if (queryContainer.match !== undefined) {
        const firstKey: string = Object.keys(queryContainer.match)[0];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const firstValue: Value = queryContainer.match[firstKey].query;
        return [firstKey, firstValue.toString()];
    }

    if (queryContainer.match_phrase !== undefined) {
        const firstKey: string = Object.keys(queryContainer.match_phrase)[0];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const firstValue: string = queryContainer.match_phrase[firstKey];
        return [firstKey, firstValue];
    }

    if (queryContainer.simple_query_string !== undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return ['tsv', queryContainer.simple_query_string.query];
    }

    // returning undefined for unsupported query-matchers
    return undefined;
};

export const mapEsQueryContainerToGraphqlFilter = (
    queryContainer: QueryContainer,
): FilterQuery | undefined => {
    if (queryContainer.match !== undefined) {
        const firstKey: string = Object.keys(queryContainer.match)[0];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const firstValue: Value = queryContainer.match[firstKey].query;
        return {
            field: firstKey,
            value: firstValue.toString(),
        };
    }

    if (queryContainer.match_phrase !== undefined) {
        const firstKey: string = Object.keys(queryContainer.match_phrase)[0];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const firstValue: string = queryContainer.match_phrase[firstKey];
        return {
            field: firstKey,
            value: firstValue,
        };
    }

    if (queryContainer.simple_query_string !== undefined) {
        return {
            field: 'tsv',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            value: queryContainer.simple_query_string.query,
        };
    }

    // returning undefined for unsupported query-matchers
    return undefined;
};

export const isValidQueryPart = (
    filter: FilterQuery | undefined,
): filter is FilterQuery => filter !== undefined;
