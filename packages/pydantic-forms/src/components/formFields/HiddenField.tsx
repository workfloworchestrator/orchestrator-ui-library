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
import React, { HTMLProps, Ref, useEffect } from "react";
import { Override, filterDOMProps, useField } from "uniforms";

export type HiddenFieldProps = Override<
    HTMLProps<HTMLInputElement>,
    {
        inputRef?: Ref<HTMLInputElement>;
        name: string;
        noDOM?: boolean;
        value?: any;
    }
>;

export default function HiddenField({ value, ...rawProps }: HiddenFieldProps) {
    const props = useField(rawProps.name, rawProps, { initialValue: false })[0];

    useEffect(() => {
        if (value !== undefined && value !== props.value) {
            props.onChange(value);
        }
    });

    return props.noDOM ? null : (
        <input
            disabled={props.disabled}
            name={props.name}
            readOnly={props.readOnly}
            ref={props.inputRef}
            type="hidden"
            value={value ?? props.value ?? ""}
            {...filterDOMProps(props)}
        />
    );
}
