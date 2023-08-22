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

import { FieldProps } from "lib/uniforms-surfnet/src/types";
import { omit } from "lodash";
import React from "react";
import { connectField, filterDOMProps } from "uniforms";

const base64 = typeof btoa !== "undefined" ? btoa : (x: string) => Buffer.from(x).toString("base64");
const escape = (x: string) => base64(encodeURIComponent(x)).replace(/=+$/, "");

export type RadioFieldProps = FieldProps<
    string,
    { allowedValues?: string[]; checkboxes?: boolean; transform?(value: string): string }
>;

function Radio({
    allowedValues,
    disabled,
    id,
    label,
    name,
    onChange,
    readOnly,
    transform,
    value,
    ...props
}: RadioFieldProps) {
    return (
        <div {...omit(filterDOMProps(props), ["checkboxes"])}>
            {label && <label style={{ fontWeight: "bolder" }}>{label}</label>}

            {allowedValues?.map((item) => (
                <div key={item}>
                    <input
                        checked={item === value}
                        disabled={disabled}
                        id={`${id}-${escape(item)}`}
                        name={name}
                        onChange={() => {
                            if (!readOnly) {
                                onChange(item);
                            }
                        }}
                        type="radio"
                    />

                    <label htmlFor={`${id}-${escape(item)}`} style={{ paddingLeft: "5px" }}>
                        {transform ? transform(item) : item}
                    </label>
                </div>
            ))}
        </div>
    );
}

export default connectField(Radio, { kind: "leaf" });
