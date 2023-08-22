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
import { LocationCodeField, SelectField } from "lib/uniforms-surfnet/src";
import React from "react";
import ApplicationContext, { ApplicationContextInterface } from "utils/ApplicationContext";

jest.mock("lib/uniforms-surfnet/src/SelectField", () => {
    return { __esModule: true, default: () => <br /> };
});

describe("<LocationCodeField>", () => {
    test("<LocationCodeField> - calls selectField with all locationCodes", () => {
        const element = (
            <ApplicationContext.Provider value={{ locationCodes: ["aaa", "bbb"] } as ApplicationContextInterface}>
                <LocationCodeField name="x" />
            </ApplicationContext.Provider>
        );
        const wrapper = mount(element, createContext({ x: { type: String } }));
        expect(wrapper.html()).toBe("<br>");
        expect(wrapper.find(SelectField)).toHaveLength(1);
        expect(wrapper.find(SelectField).props()).toMatchObject({
            allowedValues: ["aaa", "bbb"],
            disabled: false,
            error: null,
            errorMessage: "",
            required: true,
            showInlineError: false,
            value: undefined,
            placeholder: "Search and select a location code...",
        });
    });

    test("<LocationCodeField> - calls selectField with specified locationCodes", () => {
        const element = (
            <ApplicationContext.Provider value={{ locationCodes: ["aaa", "bbb"] } as ApplicationContextInterface}>
                <LocationCodeField name="x" locationCodes={["ccc", "ddd"]} />
            </ApplicationContext.Provider>
        );
        const wrapper = mount(element, createContext({ x: { type: String } }));
        expect(wrapper.html()).toBe("<br>");
        expect(wrapper.find(SelectField)).toHaveLength(1);
        expect(wrapper.find(SelectField).props()).toMatchObject({
            allowedValues: ["ccc", "ddd"],
            disabled: false,
            error: null,
            errorMessage: "",
            required: true,
            showInlineError: false,
            value: undefined,
            placeholder: "Search and select a location code...",
        });
    });
});
