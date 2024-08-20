import { GraphQLError } from 'graphql/error/GraphQLError';
import { isPlainObject } from 'lodash';

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { WfoGraphqlError } from '@/rtk/api';

export function stripUndefined(obj: object): Record<string, unknown> {
    if (!isPlainObject(obj)) {
        return obj as Record<string, unknown>;
    }
    const copy: Record<string, unknown> = { ...obj };
    for (const [k, v] of Object.entries(copy)) {
        if (v === undefined) {
            delete copy[k];
        }
    }
    return copy;
}

export const mapRtkErrorToWfoError = (
    error: FetchBaseQueryError | GraphQLError[] | SerializedError | undefined,
): WfoGraphqlError[] => {
    if (Array.isArray(error)) {
        return error.map((err): WfoGraphqlError => {
            return {
                extensions: err.extensions,
                message: err.message,
            };
        });
    } else if (error && 'message' in error && error.message !== undefined) {
        return [
            {
                extensions: {},
                message: error.message,
            },
        ];
    } else if (error && 'status' in error && error.status !== undefined) {
        return [
            {
                extensions: {},
                message: String(error.status),
            },
        ];
    }
    return [];
};
