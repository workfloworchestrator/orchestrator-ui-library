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

import SubscriptionDetail from "components/subscriptionDetail/SubscriptionDetail";
import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { SubscriptionSummaryField } from "lib/uniforms-surfnet/src";
import React from "react";

jest.mock("components/subscriptionDetail/SubscriptionDetail", () => {
    return { __esModule: true, default: () => <br /> };
});

describe("<SubscriptionSummaryField>", () => {
    test("<SubscriptionSummaryField> - renders inputs", () => {
        const element = <SubscriptionSummaryField name="x" />;

        const wrapper = mount(
            element,
            createContext({ x: { type: String, defaultValue: "48f28a55-7764-4c84-9848-964d14906a27" } })
        );

        expect(wrapper.find(SubscriptionDetail)).toHaveLength(1);
        expect(wrapper.find(SubscriptionDetail).prop("subscriptionId")).toBe("48f28a55-7764-4c84-9848-964d14906a27");
    });
});
