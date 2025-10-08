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

import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { connectField, useField } from 'uniforms';

import { useGetCustomersQuery } from '@/rtk/endpoints';

import {
    SelectFieldProps,
    UnconnectedSelectField,
} from './SelectField/SelectField';

export type CustomerFieldProps = Omit<
    SelectFieldProps,
    'placeholder' | 'transform' | 'allowedValues'
>;

function Customer({ ...props }: CustomerFieldProps) {
    const t = useTranslations('pydanticForms');
    const [, context] = useField(props.name, {}, { absoluteName: true });

    const { data: customers, isLoading } = useGetCustomersQuery();

    const uuidCustomerNameMap = new Map<string, string>();

    if (!isLoading && customers) {
        customers?.map((customer) => {
            uuidCustomerNameMap.set(
                customer.customerId,
                `${customer.shortcode} - ${customer.fullname}`,
            );
        });
    }

    const genericFieldName = props.name.split('.').shift();
    const valueFromContext =
        genericFieldName && context.model[genericFieldName];

    // RVL:19-89-24 This is the only way I found to make sure the value is set to undefined when the value
    // is removed from the form (i.e. when the user clicks the "-" button in the form) for the last list item.
    const value =
        Array.isArray(valueFromContext) && _.isEmpty(valueFromContext)
            ? ''
            : props.value;

    return (
        <UnconnectedSelectField
            {...props}
            allowedValues={Array.from(uuidCustomerNameMap.keys())}
            transform={(uuid: string) => uuidCustomerNameMap.get(uuid) || uuid}
            disabled={isLoading || props.disabled}
            value={value}
            placeholder={
                !isLoading
                    ? t('widgets.customer.placeholder')
                    : t('widgets.customer.loading')
            }
        />
    );
}

export const CustomerField = connectField(Customer, { kind: 'leaf' });
