import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { ListAddField } from "lib/uniforms-surfnet/src";
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
    createContext(merge({ x: { type: Array, maxCount: 3 }, "x.$": String }, schema), { onChange, model: { x: [] } });

beforeEach(() => {
    onChange.mockClear();
});

test("<ListAddField> - works", () => {
    const element = <ListAddField name="x.$" />;
    const wrapper = mount(element, context());

    expect(wrapper.find(ListAddField)).toHaveLength(1);
});

test("<ListAddField> - renders label when outerList", () => {
    const element = <ListAddField name="x.1" outerList={true} />;
    const wrapper = mount(element, context());

    expect(wrapper.find(ListAddField)).toHaveLength(1);
    expect(wrapper.find("label")).toHaveLength(1);
    expect(wrapper.find("label").text()).toBe("forms.fields.x_add");
});

test("<ListAddField> - prevents onClick when disabled", () => {
    const element = <ListAddField name="x.1" disabled />;
    const wrapper = mount(element, context());

    expect(wrapper.find('[role="button"]').simulate("click")).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
});

test("<ListAddField> - prevents onClick when limit reached", () => {
    const element = <ListAddField name="x.1" />;
    const wrapper = mount(element, context({ x: { maxCount: 0 } }));

    expect(wrapper.find('[role="button"]').simulate("click")).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
});

test("<ListAddField> - correctly reacts on click", () => {
    const element = <ListAddField name="x.1" value="y" />;
    const wrapper = mount(element, context());

    expect(wrapper.find('[role="button"]').simulate("click")).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", ["y"]);
});

test("<ListAddField> - correctly reacts on keyboard enter key", () => {
    const element = <ListAddField name="x.1" value="y" />;
    const wrapper = mount(element, context());

    expect(wrapper.find('[role="button"]').simulate("keydown", { key: "Enter" })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", ["y"]);
});
