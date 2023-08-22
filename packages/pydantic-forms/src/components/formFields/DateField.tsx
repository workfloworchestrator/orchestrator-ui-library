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

const DateConstructor = (typeof global === "object" ? global : window).Date;
const dateFormat = (value?: Date) => value?.toISOString().slice(0, -8);

export type DateFieldProps = FieldProps<Date, { max?: Date; min?: Date }>;

function Date({
    disabled,
    id,
    inputRef,
    label,
    max,
    min,
    name,
    onChange,
    readOnly,
    placeholder,
    value,
    ...props
}: DateFieldProps) {
    return (
        <div {...filterDOMProps(props)}>
            {label && <label htmlFor={id}>{label}</label>}

            <input
                disabled={disabled}
                id={id}
                max={dateFormat(max)}
                min={dateFormat(min)}
                name={name}
                onChange={(event) => {
                    const date = new DateConstructor(event.target.valueAsNumber);
                    if (date.getFullYear() < 10000) {
                        onChange(date);
                    } else if (isNaN(event.target.valueAsNumber)) {
                        onChange(undefined);
                    }
                }}
                placeholder={placeholder}
                readOnly={readOnly}
                ref={inputRef}
                type="datetime-local"
                value={dateFormat(value) ?? ""}
            />
        </div>
    );
}

export default connectField(Date, { kind: "leaf" });
