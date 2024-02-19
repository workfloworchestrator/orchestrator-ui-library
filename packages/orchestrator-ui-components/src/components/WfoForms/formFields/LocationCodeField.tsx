/*
 * Copyright 2019-2023 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { connectField, filterDOMProps } from 'uniforms';

import { useAxiosApiClient } from '../useAxiosApiClient';
import { SelectFieldProps, UnconnectedSelectField } from './SelectField';

export type LocationCodeFieldProps = { locationCodes?: string[] } & Omit<
    SelectFieldProps,
    'placeholder' | 'allowedValues'
>;

declare module 'uniforms' {
    interface FilterDOMProps {
        locationCodes: never;
    }
}

filterDOMProps.register('locationCodes');

function LocationCode({ locationCodes, ...props }: LocationCodeFieldProps) {
    const t = useTranslations('pydanticForms');
    const [codes, setCodes] = useState<string[]>(locationCodes ?? []);
    const axiosApiClient = useAxiosApiClient();

    useEffect(() => {
        axiosApiClient
            .axiosFetch<string[]>('surf/crm/location_codes', {}, {}, false)
            .then((result) => {
                if (result) {
                    setCodes(result);
                }
            })
            .catch((error) => {
                if (error) {
                    console.error(error);
                }
                setCodes([]);
            });
    }, [axiosApiClient]);

    return (
        <UnconnectedSelectField
            {...props}
            allowedValues={codes}
            placeholder={t('widgets.locationCode.placeholder')}
        />
    );
}

export const LocationCodeField = connectField(LocationCode, { kind: 'leaf' });
