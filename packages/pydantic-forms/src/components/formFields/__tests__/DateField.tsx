import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { DateField } from "lib/uniforms-surfnet/src";
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

test("<DateField> - renders an input", () => {
    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
});

test("<DateField> - renders a input with correct id (inherited)", () => {
    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("id")).toBeTruthy();
});

test("<DateField> - renders a input with correct id (specified)", () => {
    const element = <DateField name="x" id="y" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("id")).toBe("y");
});

test("<DateField> - renders a input with correct name", () => {
    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("name")).toBe("x");
});

test("<DateField> - renders an input with correct type", () => {
    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("type")).toBe("datetime-local");
});

test("<DateField> - renders an input with correct disabled state", () => {
    const element = <DateField name="x" disabled />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("disabled")).toBe(true);
});

test("<DateField> - renders an input with correct readOnly state", () => {
    const element = <DateField name="x" readOnly />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("readOnly")).toBe(true);
});

test("<DateField> - renders a input with correct label (specified)", () => {
    const element = <DateField name="x" label="DateFieldLabel" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("label")).toHaveLength(1);
    expect(wrapper.find("label").text()).toBe("DateFieldLabel");
    expect(wrapper.find("label").prop("htmlFor")).toBe(wrapper.find("input").prop("id"));
});

test("<DateField> - renders a input with correct value (default)", () => {
    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toBe("");
});

test("<DateField> - renders a input with correct value (model)", () => {
    const now = new Date();
    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }, { model: { x: now } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toEqual(now.toISOString().slice(0, -8));
});

test("<DateField> - renders a input with correct value (specified)", () => {
    const now = new Date();
    const element = <DateField name="x" value={now} />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toEqual(now.toISOString().slice(0, -8));
});

test("<DateField> - renders a input which correctly reacts on change", () => {
    const onChange = jest.fn();

    const now = new Date();
    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }, { onChange }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").simulate("change", { target: { valueAsNumber: now } })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", now);
});

test("<DateField> - renders a input which correctly reacts on change (empty)", () => {
    const onChange = jest.fn();

    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }, { onChange }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").simulate("change", { target: { valueAsNumber: undefined } })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", undefined);
});

test("<DateField> - renders a input which correctly reacts on change (overflow)", () => {
    const onChange = jest.fn();

    const now = new Date(1e5, 0);
    const element = <DateField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }, { onChange }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").simulate("change", { target: { valueAsNumber: now } })).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
});

test("<DateField> - renders a wrapper with unknown props", () => {
    const element = <DateField name="x" data-x="x" data-y="y" data-z="z" />;
    const wrapper = mount(element, createContext({ x: { type: Date } }));

    expect(wrapper.find("div").at(0).prop("data-x")).toBe("x");
    expect(wrapper.find("div").at(0).prop("data-y")).toBe("y");
    expect(wrapper.find("div").at(0).prop("data-z")).toBe("z");
});
