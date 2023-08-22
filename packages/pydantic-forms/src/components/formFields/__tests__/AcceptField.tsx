import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { AcceptField } from "lib/uniforms-surfnet/src";
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

const TEST_ACCEPT_DATA = [
    ["label", "label"],
    ["info", "info"],
    ["warning", "warning"],
    ["margin", "margin"],
    ["value", "value"],
    ["http://example.com", "url"],
    ["checkbox1", "checkbox"],
    ["label_with_context", "label", { foo: "bar" }],
    ["sub_checkbox", ">checkbox"],
    ["sub_checkbox2", ">checkbox"],
    ["optional_checkbox", "checkbox?"],
    ["skip_checkbox", "skip"],
];

describe("<AcceptField>", () => {
    test("<AcceptField> - legacy renders an input", () => {
        const element = <AcceptField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String } }, undefined, "acceptfield-legacy"));
        expect(wrapper.find("input")).toHaveLength(1);
        expect(wrapper.render()).toMatchSnapshot();
    });

    test("<AcceptField> - legacy renders a input which correctly reacts on change", () => {
        const onChange = jest.fn();

        const element = <AcceptField name="x" />;
        const wrapper = mount(element, createContext({ x: { type: String } }, { onChange }));

        expect(wrapper.find("input[name='x']")).toHaveLength(1);
        expect(wrapper.find("input[name='x']").simulate("change", { target: { checked: true } })).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "ACCEPTED");
        expect(wrapper.find("input[name='x']").simulate("change", { target: { checked: false } })).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "INCOMPLETE");
    });

    test("<AcceptField> - renders inputs", () => {
        const element = <AcceptField name="x" />;
        const wrapper = mount(
            element,
            createContext(
                {
                    x: {
                        type: String,
                        uniforms: {
                            data: TEST_ACCEPT_DATA,
                        },
                    },
                },
                undefined,
                "acceptfield-render"
            )
        );
        expect(wrapper.find("input")).toHaveLength(6);
        expect(wrapper.render()).toMatchSnapshot();
    });
    test("<AcceptField> - renders a input which correctly reacts on change", () => {
        const onChange = jest.fn();

        const element = <AcceptField name="x" />;
        const wrapper = mount(
            element,
            createContext(
                {
                    x: {
                        type: String,
                        uniforms: {
                            data: TEST_ACCEPT_DATA,
                        },
                    },
                },
                { onChange }
            )
        );

        expect(wrapper.find("input[name='checkbox16']")).toHaveLength(1);
        expect(wrapper.find("input[name='sub_checkbox8']")).toHaveLength(1);
        expect(wrapper.find("input[name='sub_checkbox29']")).toHaveLength(1);
        expect(wrapper.find("input[name='optional_checkbox10']")).toHaveLength(1);
        expect(wrapper.find("input[name='skip_checkbox']")).toHaveLength(1);

        expect(wrapper.find("input[name='checkbox16']").simulate("change", { target: { checked: true } })).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "INCOMPLETE");

        expect(
            wrapper.find("input[name='sub_checkbox8']").simulate("change", { target: { checked: true } })
        ).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "INCOMPLETE");

        expect(
            wrapper.find("input[name='optional_checkbox10']").simulate("change", { target: { checked: true } })
        ).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "INCOMPLETE");

        expect(
            wrapper.find("input[name='sub_checkbox29']").simulate("change", { target: { checked: true } })
        ).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "ACCEPTED");

        expect(
            wrapper.find("input[name='optional_checkbox10']").simulate("change", { target: { checked: false } })
        ).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "ACCEPTED");

        expect(
            wrapper.find("input[name='skip_checkbox']").simulate("change", { target: { checked: true } })
        ).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "SKIPPED");

        expect(
            wrapper.find("input[name='skip_checkbox']").simulate("change", { target: { checked: false } })
        ).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "INCOMPLETE");

        expect(wrapper.find("input[name='checkbox16']").simulate("change", { target: { checked: true } })).toBeTruthy();
        expect(onChange).toHaveBeenLastCalledWith("x", "INCOMPLETE");
    });
});
