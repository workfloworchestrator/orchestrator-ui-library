/**
 * Dynamic Forms
 *
 * A SWR hook for parsing the references in a JsonSchema
 *
 * In the JSON Schema there are references to other places in the object.
 * After this hook is run with the data those references will be resolved.
 */
import { useEffect, useState } from 'react';

import { parse as jsonSchemaParse } from 'jsonref';
import { isEmpty } from 'lodash';

import {
    IDynamicFormApiRefResolved,
    IDynamicFormApiResponse,
} from '@/dynamic-forms/types';

/** For reasons unclear to me the source object and children become frozen when its converted from the JSON source , we need to unfreeze it to be able to modify it */
const unFreezeSource = (
    source: IDynamicFormApiResponse,
): IDynamicFormApiResponse => {
    return {
        ...source,
        properties: {
            ...Object.fromEntries(
                Object.entries(source.properties).map(([key, value]) => {
                    return [key, { ...value }];
                }),
            ),
        },
    };
};

export function useRefParser(id: string, source: IDynamicFormApiResponse) {
    const [schema, setSchema] = useState<
        IDynamicFormApiRefResolved | undefined
    >();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        if (isEmpty(source)) {
            setSchema(undefined);
        } else {
            jsonSchemaParse(unFreezeSource(source), {
                scope: 'http://json-schema.org/draft-04/schema',
            })
                .then((schema) => {
                    setIsLoading(false);
                    setSchema(schema);
                })
                .catch((error) => {
                    console.warn('error in useRefParser', error);
                    setHasError(true);
                    setIsLoading(false);
                });
        }
    }, [id, source]);

    return {
        data: schema,
        isLoading,
        hasError,
    };
}
