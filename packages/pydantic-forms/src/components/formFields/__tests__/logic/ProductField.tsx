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

import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { ProductField, SelectField } from "lib/uniforms-surfnet/src";
import PRODUCTS_JSON from "stories/data/products.json";
import ApplicationContext, { ApplicationContextInterface } from "utils/ApplicationContext";

jest.mock("lib/uniforms-surfnet/src/SelectField", () => {
    return { __esModule: true, default: () => <br /> };
});

describe("<ProductField>", () => {
    test("<ProductField> - calls selectField with all products", async () => {
        const element = (
            <ApplicationContext.Provider
                value={({ products: PRODUCTS_JSON } as unknown) as ApplicationContextInterface}
            >
                <ProductField name="x" />
            </ApplicationContext.Provider>
        );
        const wrapper = mount(element, createContext({ x: { type: String } }));
        expect(wrapper.html()).toBe("<br>");
        expect(wrapper.find(SelectField)).toHaveLength(1);
        expect(wrapper.find(SelectField).props()).toMatchObject({
            allowedValues: [
                "e2620adb-d28c-4525-9110-ca14e7afca46",
                "78925941-83f7-4e96-925b-0d518db1b970",
                "ed0e1c83-d76f-40a4-b325-a2a300a6e7d7",
                "99e527b2-7424-48eb-9015-6f46e8a40923",
                "37b38e37-70f7-461f-ac3e-defc34a18803",
                "c738fc9e-cd74-4ade-8716-1fcd2c24da8b",
                "cd9f4a88-300c-415c-9d49-e4a2594a6770",
                "16b98a8b-9cdd-424c-9f4a-96380a7b1526",
                "62320721-e305-4900-a7d5-cc2d4ad6ca75",
                "45b04171-a197-4c85-a4fa-72bbd1d18590",
                "1932f718-67a3-4029-961f-e6cd3ad30c80",
                "36bf20d3-a1e6-41a7-8ac7-1bd669953fcf",
                "0b8fae88-9d5a-4d0f-b086-0207b3a8b737",
                "e3247076-6b34-43ec-857d-c93d018fac09",
                "25206585-358f-4422-be60-61cc03bda46f",
                "e6c9a282-c16b-4828-81ca-29957d4d848d",
                "e9a60875-d187-4737-a35d-0329b9ec1f28",
                "7f0c30ee-a988-4830-b247-d5a1d5587155",
                "8e1a49ec-6176-4f21-9e83-fca7356cec3c",
                "04f3a816-b892-474a-ba4d-58350b357e11",
                "c9b3fbf5-677c-46c3-ad79-06b3beeffdca",
                "9a8bd1ea-6650-4900-b820-3c7f0f16ef1d",
                "182b7c39-6c98-40da-9122-d7d27f61d449",
                "7a980481-8d2e-4779-9f51-3a29e8c88ad5",
                "5914a916-7980-4523-b24e-1c3f3fcc1cf4",
                "9b8046f2-8cb0-47be-9f77-59e39462aea6",
                "5867f7eb-68c2-469f-987e-2fee0672c33e",
                "4a4e2c2c-017f-43eb-b12d-836c6ea689c4",
                "a1f3cf7d-c3c5-469b-9aab-e8cafb262ad7",
                "a0a6c2b1-fcb9-4c5c-9293-5867f06a6356",
                "4163c35b-d8cb-492c-b841-700dcf3bfddf",
                "40128a3f-1303-48be-bda0-375bb3299432",
                "f19f01a3-45a4-4d21-87d9-a3f216f3a0a8",
                "31a8264c-855d-4f7a-805f-5899c3d9692c",
                "57c6e033-2fd9-4116-8bb0-5cd991a4a1e3",
            ],
            disabled: false,
            error: null,
            errorMessage: "",
            required: true,
            showInlineError: false,
            value: undefined,
            placeholder: "Search and select a product...",
        });
        //@ts-ignore
        expect(wrapper.find(SelectField).prop("transform")("e2620adb-d28c-4525-9110-ca14e7afca46")).toBe("SSP 40G");
    });

    test("<ProductField> - calls selectField with all products", () => {
        const element = (
            <ApplicationContext.Provider
                value={({ products: PRODUCTS_JSON } as unknown) as ApplicationContextInterface}
            >
                <ProductField
                    name="x"
                    productIds={[
                        "e2620adb-d28c-4525-9110-ca14e7afca46",
                        "78925941-83f7-4e96-925b-0d518db1b970",
                        "ed0e1c83-d76f-40a4-b325-a2a300a6e7d7",
                    ]}
                />
            </ApplicationContext.Provider>
        );
        const wrapper = mount(element, createContext({ x: { type: String } }));
        expect(wrapper.html()).toBe("<br>");
        expect(wrapper.find(SelectField)).toHaveLength(1);
        expect(wrapper.find(SelectField).props()).toMatchObject({
            allowedValues: [
                "e2620adb-d28c-4525-9110-ca14e7afca46",
                "78925941-83f7-4e96-925b-0d518db1b970",
                "ed0e1c83-d76f-40a4-b325-a2a300a6e7d7",
            ],
            disabled: false,
            error: null,
            errorMessage: "",
            required: true,
            showInlineError: false,
            value: undefined,
            placeholder: "Search and select a product...",
        });
        //@ts-ignore
        expect(wrapper.find(SelectField).prop("transform")("e2620adb-d28c-4525-9110-ca14e7afca46")).toBe("SSP 40G");
    });
});
