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
import React from 'react';

import { useTranslations } from 'next-intl';
import { connectField } from 'uniforms';

import { useGetCustomersQuery } from '@/rtk/endpoints';

import { SelectField, SelectFieldProps } from './SelectField';

export type OrganisationFieldProps = Omit<
    SelectFieldProps,
    'placeholder' | 'transform' | 'allowedValues'
>;

function Organisation({ ...props }: OrganisationFieldProps) {
    const t = useTranslations('pydanticForms');

    const { data: customers, isLoading } = useGetCustomersQuery();

    const uuidCustomerNameMap = new Map<string, string>();

    if (!isLoading && customers) {
        customers?.map((customer) => {
            uuidCustomerNameMap.set(customer.identifier, customer.fullname);
        });
    }

    return (
        <SelectField
            {...props}
            allowedValues={Array.from(uuidCustomerNameMap.keys())}
            transform={(uuid: string) => uuidCustomerNameMap.get(uuid) || uuid}
            disabled={isLoading}
            placeholder={
                !isLoading
                    ? t('widgets.organisation.placeholder')
                    : t('widgets.organisation.loading')
            }
        />
    );
}

export const OrganisationField = connectField(Organisation, { kind: 'leaf' });
