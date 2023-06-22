import { Value } from '@elastic/eui/src/components/search_bar/query/ast';
import { QueryContainer } from '@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl';

// Types to cast to since the QueryContainer defines the types of "match" and "simple_query_string" as "object"
type MatchObject = { query: Value };
type SimpleQueryStringObject = { query: string };

export const mapEsQueryContainerToKeyValueTuple = (
    queryContainer: QueryContainer,
): [string, string] | undefined => {
    if (queryContainer.match !== undefined) {
        const firstKey: string = Object.keys(queryContainer.match)[0];

        const firstValue = (
            queryContainer.match[
                firstKey as keyof typeof queryContainer.match
            ] as MatchObject
        ).query;

        return [firstKey, firstValue.toString()];
    }

    if (queryContainer.match_phrase !== undefined) {
        const firstKey: string = Object.keys(queryContainer.match_phrase)[0];

        const firstValue: string =
            queryContainer.match_phrase[
                firstKey as keyof typeof queryContainer.match_phrase
            ];
        return [firstKey, firstValue];
    }

    if (queryContainer.simple_query_string !== undefined) {
        const value = (
            queryContainer.simple_query_string as SimpleQueryStringObject
        ).query;
        return ['tsv', value];
    }

    // returning undefined for unsupported query-matchers
    return undefined;
};

export const isValidQueryPart = (
    filter: string[] | undefined,
): filter is [string, string] => filter?.length === 2;
