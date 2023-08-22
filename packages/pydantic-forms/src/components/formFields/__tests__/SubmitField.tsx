import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import mount from "lib/uniforms-surfnet/__tests__/_mount";
import { SubmitField } from "lib/uniforms-surfnet/src";
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

test("<SubmitField> - renders", () => {
    const element = <SubmitField />;
    const wrapper = mount(element, createContext());

    expect(wrapper).toHaveLength(1);
});

test("<SubmitField> - renders disabled if error", () => {
    const element = <SubmitField />;
    const wrapper = mount(element, createContext(undefined, { error: {} }));

    expect(wrapper).toHaveLength(1);
    expect(wrapper.find("input").prop("disabled")).toBe(true);
});

test("<SubmitField> - renders enabled if error and enabled", () => {
    const element = <SubmitField disabled={false} />;
    const wrapper = mount(element, createContext(undefined, { error: {} }));

    expect(wrapper).toHaveLength(1);
    expect(wrapper.find("input").prop("disabled")).toBe(false);
});

test("<SubmitField> - renders a wrapper with correct value", () => {
    const element = <SubmitField value="Example" />;
    const wrapper = mount(element, createContext());

    expect(wrapper).toHaveLength(1);
    expect(wrapper.find("input").prop("value")).toBe("Example");
});
