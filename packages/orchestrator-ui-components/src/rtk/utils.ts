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

function isSerializedError(
    error: SerializedError | undefined,
): error is SerializedError {
    if (error) {
        return (
            error &&
            typeof error === 'object' &&
            ('name' in error ||
                'message' in error ||
                'stack' in error ||
                'code' in error)
        );
    }
    return false;
}

const UNKNOWN_ERROR_MESSAGE = 'Unknown error';

const getSerializedErrorMessage = (error: SerializedError) => {
    if (error.message) {
        return error.message;
    } else if (error.name) {
        return error.name;
    } else if (error.code) {
        return error.code;
    } else if (error.stack) {
        return error.stack;
    }
    return UNKNOWN_ERROR_MESSAGE;
};

export const mapRtkErrorToWfoError = (
    error: FetchBaseQueryError | GraphQLError[] | SerializedError | undefined,
): WfoGraphqlError[] | undefined => {
    if (Array.isArray(error)) {
        return error.map((err): WfoGraphqlError => {
            return {
                extensions: err.extensions,
                message: err.message,
            };
        });
    } else if (error && 'status' in error && error.status !== undefined) {
        return [
            {
                extensions: {},
                message: String(error.status),
            },
        ];
    } else if (isSerializedError(error)) {
        return [
            {
                extensions: {},
                message: getSerializedErrorMessage(error),
            },
        ];
    }
    return error;
};
