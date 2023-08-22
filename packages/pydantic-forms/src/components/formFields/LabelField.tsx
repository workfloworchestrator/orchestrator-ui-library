import { FieldProps } from "lib/uniforms-surfnet/src/types";
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
import { connectField, filterDOMProps } from "uniforms";

export type LabelFieldProps = FieldProps<null, {}, null, HTMLDivElement>;

// onChange not used on purpose
function Label({ id, name, value, label, onChange, ...props }: LabelFieldProps) {
    return (
        <section {...filterDOMProps(props)}>
            <label id={id} className={`euiFormLabel euiFormRow__label${value ? "__large" : ""}`}>
                {value ? value : label}
            </label>
        </section>
    );
}

export default connectField(Label, { kind: "leaf" });
