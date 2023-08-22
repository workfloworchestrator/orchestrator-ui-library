import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { OptGroupField } from "lib/uniforms-surfnet/src";
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

test("<OptGroupField> - renders an the correct fields when disabled", () => {
    const element = <OptGroupField name="x" id="snapshot-test" />;
    const wrapper = mount(
        element,
        createContext(
            {
                x: { type: Object },
                "x.enabled": { type: Boolean },
                "x.b": { type: Number },
                "x.c": { type: Number },
            },
            undefined,
            "optgroupfield-disabled"
        )
    );

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").at(0).prop("name")).toBe("x.enabled");
    expect(wrapper.render()).toMatchSnapshot();
});

test("<OptGroupField> - renders an the correct fields when enabled", () => {
    const element = <OptGroupField name="x" id="snapshot-test" />;
    const wrapper = mount(
        element,
        createContext(
            {
                x: { type: Object },
                "x.enabled": { type: Boolean },
                "x.b": { type: Number },
                "x.c": { type: Number },
            },
            { model: { x: { enabled: true } } },
            "optgroupfield-enabled"
        )
    );

    expect(wrapper.find("input")).toHaveLength(3);
    expect(wrapper.find("input").at(0).prop("name")).toBe("x.enabled");
    expect(wrapper.find("input").at(1).prop("name")).toBe("x.b");
    expect(wrapper.find("input").at(2).prop("name")).toBe("x.c");
    expect(wrapper.render()).toMatchSnapshot();
});

test("<OptGroupField> - renders a label", () => {
    const element = <OptGroupField name="x" label="y" />;
    const wrapper = mount(
        element,
        createContext({
            x: { type: Object },
            "x.enabled": { type: Boolean },
            "x.b": { type: Number },
        })
    );

    expect(wrapper.find("label")).toHaveLength(2);
    expect(wrapper.find("span.euiDescribedFormGroup__title").text()).toBe("forms.fields.x.title");
    expect(wrapper.find("div.euiDescribedFormGroup__description").text()).toBe("forms.fields.x.info");
});

test("<OptGroupField> - renders a wrapper with unknown props", () => {
    const element = <OptGroupField name="x" data-x="x" data-y="y" data-z="z" />;
    const wrapper = mount(
        element,
        createContext({
            x: { type: Object },
            "x.enabled": { type: Boolean },
            "x.b": { type: Number },
        })
    );

    expect(wrapper.find(".optgroup-field").at(0).prop("data-x")).toBe("x");
    expect(wrapper.find(".optgroup-field").at(0).prop("data-y")).toBe("y");
    expect(wrapper.find(".optgroup-field").at(0).prop("data-z")).toBe("z");
});
