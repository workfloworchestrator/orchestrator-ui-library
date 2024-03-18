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
import { useQuery } from 'react-query';

import get from 'lodash/get';
import { useTranslations } from 'next-intl';
import { connectField, filterDOMProps } from 'uniforms';

import type { LegacyProduct } from '@/api/types';

import { useAxiosApiClient } from '../useAxiosApiClient';
import { SelectFieldProps, UnconnectedSelectField } from './SelectField';

export type ProductFieldProps = { productIds?: string[] } & Omit<
    SelectFieldProps,
    'placeholder' | 'transform' | 'allowedValues'
>;
declare module 'uniforms' {
    interface FilterDOMProps {
        productIds: never;
    }
}
filterDOMProps.register('productIds');

function Product({ name, productIds, ...props }: ProductFieldProps) {
    const apiClient = useAxiosApiClient();
    const t = useTranslations('pydanticForms');
    const { isLoading, error, data } = useQuery(
        ['products'],
        apiClient.products,
    );

    const productById = (
        id: string,
        products: LegacyProduct[],
    ): LegacyProduct => {
        return products.find((prod) => prod.product_id === id)!;
    };

    if (isLoading || error || !data) return null;

    const products = productIds
        ? productIds?.map((id) => productById(id, data))
        : data;

    const productLabelLookup =
        products?.reduce<{ [index: string]: string }>(function (
            mapping,
            product,
        ) {
            mapping[product.product_id] = product.name;
            return mapping;
        }, {}) ?? {};

    return (
        <UnconnectedSelectField
            name={name}
            {...props}
            allowedValues={Object.keys(productLabelLookup)}
            transform={(uuid: string) => get(productLabelLookup, uuid, uuid)}
            placeholder={t('widgets.product.placeholder')}
        />
    );
}

export const ProductField = connectField(Product);
