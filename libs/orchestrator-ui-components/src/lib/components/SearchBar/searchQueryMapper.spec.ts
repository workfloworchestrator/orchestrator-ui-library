import {
    isValidQueryPart,
    mapEsQueryContainerToKeyValueTuple,
} from './searchQueryMapper';
import { QueryContainer } from '@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl';

describe('searchQueryMapper', () => {
    describe('mapEsQueryContainerToKeyValueTuple', () => {
        it('maps a match part with a string value to key-value tuple', () => {
            const queryContainer: QueryContainer = {
                match: {
                    testKey: {
                        query: 'testValue',
                    },
                },
            };

            const result = mapEsQueryContainerToKeyValueTuple(queryContainer);

            expect(result).toEqual(['testKey', 'testValue']);
        });

        it('maps a match part with a boolean value to key-value tuple', () => {
            const queryContainer: QueryContainer = {
                match: {
                    testKey: {
                        query: true,
                    },
                },
            };

            const result = mapEsQueryContainerToKeyValueTuple(queryContainer);

            expect(result).toEqual(['testKey', 'true']);
        });

        it('maps a match-phrase part to key-value tuple', () => {
            const queryContainer: QueryContainer = {
                match_phrase: {
                    testKey: 'testValue with spaces',
                },
            };

            const result = mapEsQueryContainerToKeyValueTuple(queryContainer);

            expect(result).toEqual(['testKey', 'testValue with spaces']);
        });

        it('maps a simple-query-string part to key-value tuple with "tsv" as key', () => {
            const queryContainer: QueryContainer = {
                simple_query_string: {
                    query: 'testValue',
                },
            };

            const result = mapEsQueryContainerToKeyValueTuple(queryContainer);

            expect(result).toEqual(['tsv', 'testValue']);
        });

        it('maps an unsupported part to undefined', () => {
            const queryContainer: QueryContainer = {
                bool: {
                    must_not: [],
                },
            };

            const result = mapEsQueryContainerToKeyValueTuple(queryContainer);

            expect(result).toBeUndefined();
        });
    });

    describe('isValidQueryPart', () => {
        it('returns true for valid parts', () => {
            const filter = ['testKey', 'testValue'];
            const result = isValidQueryPart(filter);
            expect(result).toBe(true);
        });

        it('returns false for parts being undefined', () => {
            const filter = undefined;
            const result = isValidQueryPart(filter);
            expect(result).toBe(false);
        });

        it('returns false for parts not being arrays with length of 2', () => {
            const filter = ['testKey'];
            const result = isValidQueryPart(filter);
            expect(result).toBe(false);
        });
    });
});
