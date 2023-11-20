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

import { GET_CUSTOMER_GRAPHQL_QUERY } from '../../../graphqlQueries';
import { useQueryWithGraphql } from '../../../hooks';
import { SelectField, SelectFieldProps } from './SelectField';

export type OrganisationFieldProps = Omit<
    SelectFieldProps,
    'placeholder' | 'transform' | 'allowedValues'
>;

function Organisation({ ...props }: OrganisationFieldProps) {
    const t = useTranslations('pydanticForms');

    const { data, isFetched } = useQueryWithGraphql(
        GET_CUSTOMER_GRAPHQL_QUERY,
        {},
        'customers',
    );

    const uuidCustomerNameMap = new Map<string, string>();

    if (isFetched) {
        const customers = data?.customers.page;
        customers?.map((customer) => {
            uuidCustomerNameMap.set(customer.identifier, customer.fullname);
        });
    }

    return (
        <SelectField
            {...props}
            allowedValues={Array.from(uuidCustomerNameMap.keys())}
            transform={(uuid: string) => uuidCustomerNameMap.get(uuid) || uuid}
            placeholder={t('widgets.organisation.placeholder')}
        />
    );
}

export const OrganisationField = connectField(Organisation, { kind: 'leaf' });
