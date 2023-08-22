import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { ListAddField, ListField, ListItemField } from "lib/uniforms-surfnet/src";
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
import React from "react";

test("<ListField> - works", () => {
    const element = <ListField name="x" id="snapshot-test" />;
    const wrapper = mount(
        element,
        createContext({ x: { type: Array }, "x.$": { type: String } }, undefined, "listfield-works")
    );

    expect(wrapper.find(ListField)).toHaveLength(1);
    expect(wrapper.render()).toMatchSnapshot();
});

test("<ListField> - renders ListAddField", () => {
    const element = <ListField name="x" label="ListFieldLabel" />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find(ListAddField)).toHaveLength(1);
    expect(wrapper.find(ListAddField).prop("name")).toBe("$");
});

test("<ListField> - renders correct label (specified)", () => {
    const element = <ListField name="x" label="ListFieldLabel" />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find(".euiFormLabel")).toHaveLength(2);
    expect(wrapper.find(".euiFormLabel").at(0).text()).toEqual(expect.stringContaining("ListFieldLabel"));
});

test("<ListField> - renders correct numer of items with initialCount (specified)", () => {
    const element = <ListField name="x" initialCount={3} />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find("input")).toHaveLength(3);
});

test("<ListField> - passes itemProps to its children", () => {
    const element = <ListField name="x" initialCount={3} itemProps={{ "data-xyz": 1 }} />;
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find(ListItemField).first().prop("data-xyz")).toBe(1);
});

test("<ListField> - renders children (specified)", () => {
    const Child = jest.fn(() => <div />) as React.FC<any>;

    const element = (
        <ListField name="x" initialCount={2}>
            <Child />
            PlainText
        </ListField>
    );
    mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(Child).toHaveBeenCalledTimes(2);
});

test("<ListField> - renders children with correct name (children)", () => {
    const Child = jest.fn(() => <div />) as React.FC<any>;

    const element = (
        <ListField name="x" initialCount={2}>
            <Child name="$" />
        </ListField>
    );
    const wrapper = mount(element, createContext({ x: { type: Array }, "x.$": { type: String } }));

    expect(wrapper.find(Child).at(0).prop("name")).toBe("0");
    expect(wrapper.find(Child).at(1).prop("name")).toBe("1");
});

test("<ListField> - renders children with correct values", () => {
    const element = <ListField name="x" id="snapshot-test" />;
    const wrapper = mount(
        element,
        createContext(
            { x: { type: Array }, "x.$": { type: String } },
            { model: { x: ["a", "b", "c"] } },
            "listfield-correct-values"
        )
    );

    expect(wrapper.find(ListItemField)).toHaveLength(3);

    expect(wrapper.find("input").at(0).prop("value")).toBe("a");
    expect(wrapper.find("input").at(1).prop("value")).toBe("b");

    expect(wrapper.find("input").at(2).prop("value")).toBe("c");
    expect(wrapper.render()).toMatchSnapshot();
});

test("<ListField> - renders children with correct name (value)", () => {
    const element = <ListField name="x" initialCount={2} id="snapshot-test" />;
    const wrapper = mount(
        element,
        createContext({ x: { type: Array }, "x.$": { type: String } }, undefined, "listfield-correct-name")
    );

    expect(wrapper.find(ListItemField).at(0).prop("name")).toBe("0");
    expect(wrapper.find(ListItemField).at(1).prop("name")).toBe("1");
    expect(wrapper.render()).toMatchSnapshot();
});

test("<ListField> - renders correctly when child is list", () => {
    const element = <ListField name="x" id="snapshot-test" />;
    const wrapper = mount(
        element,
        createContext(
            { x: { type: Array }, "x.$": { type: Array }, "x.$.$": { type: String } },
            { model: { x: [["test"]] } },
            "listfield-childlist"
        )
    );

    expect(wrapper.find(ListItemField)).toHaveLength(2);
    expect(wrapper.find(ListItemField).at(0).prop("outerList")).toBe(true);
    expect(wrapper.find(ListItemField).at(1).prop("outerList")).toBe(false);
    expect(wrapper.find(ListAddField)).toHaveLength(2);
    expect(wrapper.find(ListAddField).at(0).prop("outerList")).toBe(false);
    expect(wrapper.find(ListAddField).at(1).prop("outerList")).toBe(true);

    expect(wrapper.find("section")).toHaveLength(3);
    expect(wrapper.find("section").at(0).prop("className")).toBe("list-field outer-list");
    expect(wrapper.find("section").at(1).prop("className")).toBe("list-field");
    expect(wrapper.find(ListField).at(0).render()).toMatchSnapshot();
});

test("<ListField> - renders proper number of optional values after add new value (with initialCount)", () => {
    const element = <ListField name="x" initialCount={3} label="ListFieldLabel" />;
    const onChange = jest.fn();
    const wrapper = mount(
        element,
        createContext({ x: { type: Array, optional: true }, "x.$": { type: String } }, { onChange })
    );
    expect(wrapper.find(ListAddField).simulate("click")).toBeTruthy();
    expect(onChange).toHaveBeenNthCalledWith(1, "x", [undefined, undefined, undefined, undefined]);
});
