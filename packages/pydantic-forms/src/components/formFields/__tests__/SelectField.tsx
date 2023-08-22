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

import waitForComponentToPaint from "__tests__/waitForComponentToPaint";
import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { ListField, SelectField } from "lib/uniforms-surfnet/src";
import React from "react";
import ReactSelect from "react-select";

describe("<SelectField>", () => {
    test("<SelectField> - renders an input", () => {
        const element = <SelectField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
    });

    test("<SelectField> - renders a select with correct disabled state", () => {
        const element = <SelectField name="x" disabled />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("isDisabled")).toBe(true);
    });

    test("<SelectField> - renders a select with correct readOnly state", () => {
        const onChange = jest.fn();

        const element = <SelectField name="x" readOnly />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }, { onChange }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        wrapper.find(ReactSelect).invoke("onChange")({ value: "b" });
        expect(onChange).not.toHaveBeenCalled();
    });

    test("<SelectField> - renders a select with correct id (inherited)", () => {
        const element = <SelectField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("id")).toBeTruthy();
    });

    test("<SelectField> - renders a select with correct id (specified)", () => {
        const element = <SelectField name="x" id="y" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("id")).toBe("y");
    });

    test("<SelectField> - renders a select with correct name", () => {
        const element = <SelectField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("name")).toBe("x");
    });

    test("<SelectField> - renders a select with correct options", () => {
        const element = <SelectField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "a", text: "a", value: "a" },
            { label: "b", text: "b", value: "b" },
        ]);
    });

    test("<SelectField> - renders a select with correct options (transform)", () => {
        const element = <SelectField name="x" transform={(x: string) => x.toUpperCase()} />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "A", text: "A", value: "a" },
            { label: "B", text: "B", value: "b" },
        ]);
    });

    test("<SelectField> - renders a select with correct placeholder (fallback)", () => {
        const element = <SelectField name="x" placeholder="" />;
        const wrapper = mount(
            element,
            createContext({
                x: { type: String, allowedValues: ["a", "b"], optional: true },
            })
        );

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "a", text: "a", value: "a" },
            { label: "b", text: "b", value: "b" },
        ]);
        expect(wrapper.find(ReactSelect).prop("placeholder")).toBe("Search and select a value...");
    });

    test("<SelectField> - renders a select with correct placeholder (implicit)", () => {
        const element = <SelectField name="x" placeholder="y" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("options")).toStrictEqual([
            { label: "a", text: "a", value: "a" },
            { label: "b", text: "b", value: "b" },
        ]);
        expect(wrapper.find(ReactSelect).prop("placeholder")).toBe("y");
    });

    test("<SelectField> - renders a select with correct value (default)", () => {
        const element = <SelectField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("value")).toBe(undefined);
    });

    test("<SelectField> - renders a select with correct value (model)", () => {
        const element = <SelectField name="x" id="snapshot-test" />;
        const wrapper = mount(
            element,
            createContext(
                { x: { type: String, allowedValues: ["a", "b"] } },
                { model: { x: "b" } },
                "selectfield-model"
            )
        );

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("value")).toStrictEqual({ label: "b", text: "b", value: "b" });
        expect(wrapper.render()).toMatchSnapshot();
    });

    test("<SelectField> - renders a select with correct value (specified)", () => {
        const element = <SelectField name="x" value="b" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        expect(wrapper.find(ReactSelect).prop("value")).toStrictEqual({ label: "b", text: "b", value: "b" });
    });

    test("<SelectField> - renders a select which correctly reacts on change", () => {
        const onChange = jest.fn();

        const element = <SelectField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }, { onChange }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        wrapper.find(ReactSelect).invoke("onChange")({ value: "b" });

        expect(onChange).toHaveBeenLastCalledWith("x", "b");
    });

    test("<SelectField> - renders a select which correctly reacts on change (empty)", () => {
        const onChange = jest.fn();

        const element = <SelectField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }, { onChange }));

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        wrapper.find(ReactSelect).invoke("onChange")(undefined);

        expect(onChange).toHaveBeenLastCalledWith("x", undefined);
    });

    test("<SelectField> - renders a select which correctly reacts on change (same value)", () => {
        const onChange = jest.fn();

        const element = <SelectField name="x" />;
        const wrapper = mount(
            element,
            createContext({ x: { type: String, allowedValues: ["a", "b"] } }, { model: { x: "b" }, onChange })
        );

        expect(wrapper.find(ReactSelect)).toHaveLength(1);
        wrapper.find(ReactSelect).invoke("onChange")({ value: "b" });

        expect(onChange).toHaveBeenLastCalledWith("x", "b");
    });

    test("<SelectField> - renders a label", () => {
        const element = <SelectField name="x" label="y" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find("label")).toHaveLength(1);
        expect(wrapper.find("label").prop("children")).toContain("y");
        expect(wrapper.find("label").prop("htmlFor")).toBe(wrapper.find(ReactSelect).prop("id"));
    });

    test("<SelectField> - renders a wrapper with unknown props", () => {
        const element = <SelectField name="x" data-x="x" data-y="y" data-z="z" />;
        const wrapper = mount(element, createContext({ x: { type: String, allowedValues: ["a", "b"] } }));

        expect(wrapper.find("section").at(0).prop("data-x")).toBe("x");
        expect(wrapper.find("section").at(0).prop("data-y")).toBe("y");
        expect(wrapper.find("section").at(0).prop("data-z")).toBe("z");
    });

    test("<SelectField> - renders a select with correct value (as uniqueItem list child)", async () => {
        const element = <ListField name="x" id="snapshot-test" />;
        const wrapper = mount(
            element,
            createContext(
                {
                    x: { type: Array, uniforms: { uniqueItems: true } },
                    "x.$": { type: String, allowedValues: ["a", "b"] },
                },
                { model: { x: ["a", undefined] } },
                "selectfield-uniqueitem"
            )
        );

        await waitForComponentToPaint(wrapper);

        expect(wrapper.find(ReactSelect)).toHaveLength(2);
        expect(wrapper.find(ReactSelect).at(0).prop("value")).toStrictEqual({ label: "a", text: "a", value: "a" });
        expect(wrapper.find(ReactSelect).at(1).prop("value")).toStrictEqual(undefined);
        expect(wrapper.find(ReactSelect).at(1).prop("options")).toStrictEqual([{ label: "b", text: "b", value: "b" }]);
        expect(wrapper.render()).toMatchSnapshot();
    });

    test("<SelectField> - works with special characters", () => {
        mount(<SelectField name="x" />, createContext({ x: { type: String, allowedValues: ["ă", "ș"] } }));
    });
});
