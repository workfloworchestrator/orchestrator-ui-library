import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { ListDelField } from "lib/uniforms-surfnet/src";
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
import merge from "lodash/merge";
import React from "react";

const onChange = jest.fn();
const context = (schema?: object) =>
    createContext(merge({ x: { type: Array, maxCount: 3 }, "x.$": String }, schema), {
        onChange,
        model: { x: ["x", "y", "z"] },
    });

beforeEach(() => {
    onChange.mockClear();
});

test("<ListDelField> - works", () => {
    const element = <ListDelField name="x.1" />;
    const wrapper = mount(element, context());

    expect(wrapper.find(ListDelField)).toHaveLength(1);
    expect(wrapper.find("label")).toHaveLength(1);
    expect(wrapper.find("label").text()).toBe("");
});

test("<ListDelField> - renders label when outerList", () => {
    const element = <ListDelField name="x.1" outerList={true} />;
    const wrapper = mount(element, context());

    expect(wrapper.find(ListDelField)).toHaveLength(1);
    expect(wrapper.find("label")).toHaveLength(1);
    expect(wrapper.find("label").text()).toBe("forms.fields.x_del");
});

test("<ListDelField> - prevents onClick when disabled", () => {
    const element = <ListDelField name="x.1" disabled />;
    const wrapper = mount(element, context());

    expect(wrapper.find('[role="button"]').simulate("click")).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
});

test("<ListDelField> - prevents onClick when limit reached", () => {
    const element = <ListDelField name="x.1" />;
    const wrapper = mount(element, context({ x: { minCount: 3 } }));

    expect(wrapper.find('[role="button"]').simulate("click")).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
});

test("<ListDelField> - correctly reacts on click", () => {
    const element = <ListDelField name="x.1" />;
    const wrapper = mount(element, context());

    expect(wrapper.find('[role="button"]').simulate("click")).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", ["x", "z"]);
});

test("<ListDelField> - correctly reacts on keyboard enter key", () => {
    const element = <ListDelField name="x.1" />;
    const wrapper = mount(element, context());

    expect(wrapper.find('[role="button"]').simulate("keydown", { key: "Enter" })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", ["x", "z"]);
});
