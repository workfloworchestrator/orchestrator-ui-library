import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { TextField } from "lib/uniforms-surfnet/src";
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

test("<TextField> - renders an input", () => {
    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
});

test("<TextField> - renders an input with correct disabled state", () => {
    const element = <TextField name="x" disabled />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("disabled")).toBe(true);
});

test("<TextField> - renders an input with correct readOnly state", () => {
    const element = <TextField name="x" readOnly />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("readOnly")).toBe(true);
});

test("<TextField> - renders an input with correct id (inherited)", () => {
    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("id")).toBeTruthy();
});

test("<TextField> - renders an input with correct id (specified)", () => {
    const element = <TextField name="x" id="y" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("id")).toBe("y");
});

test("<TextField> - renders an input with correct name", () => {
    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("name")).toBe("x");
});

test("<TextField> - renders an input with correct placeholder", () => {
    const element = <TextField name="x" placeholder="y" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("placeholder")).toBe("y");
});

test("<TextField> - renders an input with correct type", () => {
    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("type")).toBe("text");
});

test("<TextField> - renders an input with correct value (default)", () => {
    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toBe("");
});

test("<TextField> - renders an input with correct value (model)", () => {
    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { model: { x: "y" } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toBe("y");
});

test("<TextField> - renders an input with correct value (specified)", () => {
    const element = <TextField name="x" value="y" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toBe("y");
});

test("<TextField> - renders an input which correctly reacts on change", () => {
    const onChange = jest.fn();

    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").simulate("change", { target: { value: "y" } })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", "y");
});

test("<TextField> - renders an input which correctly reacts on change (empty)", () => {
    const onChange = jest.fn();

    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").simulate("change", { target: { value: "" } })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", "");
});

test("<TextField> - renders an input which correctly reacts on change (same value)", () => {
    const onChange = jest.fn();

    const element = <TextField name="x" />;
    const wrapper = mount(element, createContext({ x: { type: String } }, { model: { x: "y" }, onChange }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").simulate("change", { target: { value: "y" } })).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith("x", "y");
});

test("<TextField> - renders a label", () => {
    const element = <TextField name="x" label="y" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("label")).toHaveLength(1);
    expect(wrapper.find("label").text()).toBe("y");
    expect(wrapper.find("label").prop("htmlFor")).toBe(wrapper.find("input").prop("id"));
});

test("<TextField> - renders a wrapper with unknown props", () => {
    const element = <TextField name="x" data-x="x" data-y="y" data-z="z" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("section").at(0).prop("data-x")).toBe("x");
    expect(wrapper.find("section").at(0).prop("data-y")).toBe("y");
    expect(wrapper.find("section").at(0).prop("data-z")).toBe("z");
});

test("<TextField> - renders an input with autocomplete turned off", () => {
    const element = <TextField name="x" autoComplete="off" />;
    const wrapper = mount(element, createContext({ x: { type: String } }));

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").prop("autoComplete")).toBe("off");
});
