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

import SelectField, { SelectFieldProps } from "lib/uniforms-surfnet/src/SelectField";
import get from "lodash/get";
import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { connectField, filterDOMProps } from "uniforms";
import ApplicationContext from "utils/ApplicationContext";
import { productById } from "utils/Lookups";

export type ProductFieldProps = { productIds?: string[] } & Omit<
    SelectFieldProps,
    "placeholder" | "transform" | "allowedValues"
>;
declare module "uniforms" {
    interface FilterDOMProps {
        productIds: never;
    }
}
filterDOMProps.register("productIds");

function Product({ name, productIds, ...props }: ProductFieldProps) {
    const intl = useIntl();
    const all_products = useContext(ApplicationContext).products;

    const products = productIds ? productIds.map((id) => productById(id, all_products)) : all_products;

    const productLabelLookup =
        products.reduce<{ [index: string]: string }>(function (mapping, product) {
            mapping[product.product_id] = product.name;
            return mapping;
        }, {}) ?? {};

    return (
        <SelectField
            name=""
            {...props}
            allowedValues={Object.keys(productLabelLookup)}
            transform={(uuid: string) => get(productLabelLookup, uuid, uuid)}
            placeholder={intl.formatMessage({ id: "forms.widgets.product.placeholder" })}
        />
    );
}

export default connectField(Product);
