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

import get from 'lodash/get';
import React from 'react';
import { connectField, filterDOMProps } from 'uniforms';
import { useQuery } from 'react-query';

import { apiClient } from '../../../api';
import SelectField, { SelectFieldProps } from './SelectField';
import { ProductDefinition } from '../../../types';

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
    const { isLoading, error, data } = useQuery(
        ['products'],
        apiClient.products,
    );

    const productById = (
        id: string,
        products: ProductDefinition[],
    ): ProductDefinition => {
        return products.find((prod) => prod.productId === id)!;
    };

    if (isLoading || error) return null;

    const products = productIds
        ? data?.map((id) => productById(id.productId, data))
        : data;

    const productLabelLookup =
        products?.reduce<{ [index: string]: string }>(function (
            mapping,
            product,
        ) {
            mapping[product.productId] = product.name;
            return mapping;
        }, {}) ?? {};

    return (
        <SelectField
            name={name}
            {...props}
            allowedValues={Object.keys(productLabelLookup)}
            transform={(uuid: string) => get(productLabelLookup, uuid, uuid)}
            placeholder="Choos product"
        />
    );
}

export default connectField(Product);
