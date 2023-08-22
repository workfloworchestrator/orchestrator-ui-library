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
import { ListField, NestField } from "lib/uniforms-surfnet/src";
import React from "react";
import { AutoField } from "uniforms-unstyled";

test("<NestField> - renders an <AutoField> for each field", () => {
    const element = <NestField name="x" id="snapshot-test" />;
    const wrapper = mount(
        element,
        createContext(
            {
                x: { type: Object },
                "x.a": { type: String },
                "x.b": { type: Number },
            },
            undefined,
            "nestfield-autofield"
        )
    );

    expect(wrapper.find(AutoField)).toHaveLength(2);
    expect(wrapper.find(AutoField).at(0).prop("name")).toBe("a");
    expect(wrapper.find(AutoField).at(1).prop("name")).toBe("b");
    expect(wrapper.render()).toMatchSnapshot();
});

test("<NestField> - renders custom content if given", () => {
    const element = (
        <NestField name="x">
            <article data-test="content" />
        </NestField>
    );
    const wrapper = mount(
        element,
        createContext({
            x: { type: Object },
            "x.a": { type: String },
            "x.b": { type: Number },
        })
    );

    expect(wrapper.find(AutoField)).toHaveLength(0);
    expect(wrapper.find("article")).toHaveLength(1);
    expect(wrapper.find("article").prop("data-test")).toBe("content");
});

test("<NestField> - renders a label", () => {
    const element = <NestField name="x" label="y" />;
    const wrapper = mount(
        element,
        createContext({
            x: { type: Object },
            "x.a": { type: String },
            "x.b": { type: Number },
        })
    );

    expect(wrapper.find("label")).toHaveLength(2);
    expect(wrapper.find("span.euiTitle").at(0).text()).toBe("y");
});

test("<NestField> - renders a wrapper with unknown props", () => {
    const element = <NestField name="x" data-x="x" data-y="y" data-z="z" />;
    const wrapper = mount(
        element,
        createContext({
            x: { type: Object },
            "x.a": { type: String },
            "x.b": { type: Number },
        })
    );

    expect(wrapper.find(".nest-field").at(0).prop("data-x")).toBe("x");
    expect(wrapper.find(".nest-field").at(0).prop("data-y")).toBe("y");
    expect(wrapper.find(".nest-field").at(0).prop("data-z")).toBe("z");
});

test("<NestField> - renders correctly in list", () => {
    const element = <ListField name="x" id="snapshot-test" />;
    const wrapper = mount(
        element,
        createContext(
            {
                x: { type: Array },
                "x.$": { type: Object },
                "x.$.a": { type: String },
                "x.$.b": { type: Number },
            },
            undefined,
            "nestfield-list"
        )
    );

    expect(wrapper.render()).toMatchSnapshot();
});
