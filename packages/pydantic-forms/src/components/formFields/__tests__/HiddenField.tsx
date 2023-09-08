import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { HiddenField } from "lib/uniforms-surfnet/src";
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

test("<HiddenField> - renders an input", () => {
    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
});

test("<HiddenField> - renders an input with correct id (inherited)", () => {
    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("id")).toBeTruthy();
});

test("<HiddenField> - renders an input with correct id (specified)", () => {
    const element = <HiddenField name="x" id="y" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("id")).toBe("y");
});

test("<HiddenField> - renders an input with correct name", () => {
    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("name")).toBe("x");
});

test("<HiddenField> - renders an input with correct type", () => {
    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("type")).toBe("hidden");
});

test("<HiddenField> - renders an input with correct value (default)", () => {
    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toBe("");
});

test("<HiddenField> - renders an input with correct value (model)", () => {
    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { model: { x: "y" } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toBe("y");
});

test("<HiddenField> - renders an input which correctly reacts on model change", () => {
    const onChange = jest.fn();

    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));

    wrapper.setProps({ value: "y" });

    expect(onChange).toHaveBeenLastCalledWith("x", "y");
});

test("<HiddenField> - renders an input which correctly reacts on model change (empty)", () => {
    const onChange = jest.fn();

    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));

    wrapper.setProps({ value: undefined });

    expect(onChange).not.toHaveBeenCalled();
});

test("<HiddenField> - renders an input which correctly reacts on model change (same value)", () => {
    const onChange = jest.fn();

    const element = <HiddenField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { model: { x: "y" }, onChange }));

    wrapper.setProps({ value: "y" });

    expect(onChange).not.toHaveBeenCalled();
});

test("<HiddenField noDOM> - renders nothing", () => {
    const element = <HiddenField noDOM name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.children()).toHaveLength(0);
});

test("<HiddenField noDOM> - renders nothing which correctly reacts on model change", () => {
    const onChange = jest.fn();

    const element = <HiddenField noDOM name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));

    wrapper.setProps({ value: "y" });

    expect(onChange).toHaveBeenLastCalledWith("x", "y");
});

test("<HiddenField noDOM> - renders nothing which correctly reacts on model change (empty)", () => {
    const onChange = jest.fn();

    const element = <HiddenField noDOM name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));

    wrapper.setProps({ value: undefined });

    expect(onChange).not.toHaveBeenCalled();
});

test("<HiddenField noDOM> - renders nothing which correctly reacts on model change (same value)", () => {
    const onChange = jest.fn();

    const element = <HiddenField noDOM name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { model: { x: "y" }, onChange }));

    wrapper.setProps({ value: "y" });

    expect(onChange).not.toHaveBeenCalled();
});
