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
import { EuiFieldNumber, EuiFormRow, EuiText } from "@elastic/eui";
import { FieldProps } from "lib/uniforms-surfnet/src/types";
import React from "react";
import NumericInput from "react-numeric-input";
import { connectField, filterDOMProps } from "uniforms";

export type NumFieldProps = FieldProps<
    number,
    { max?: number; min?: number; precision?: number; step?: number },
    NumericInput
>;

function Num({
    disabled,
    id,
    inputRef,
    label,
    description,
    max,
    min,
    precision,
    name,
    onChange,
    placeholder,
    readOnly,
    step,
    value,
    error,
    showInlineError,
    errorMessage,
    ...props
}: NumFieldProps) {
    return (
        <div {...filterDOMProps(props)}>
            <EuiFormRow
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={showInlineError ? errorMessage : false}
                isInvalid={error}
                id={id}
                fullWidth
            >
                <EuiFieldNumber
                    name={name}
                    isInvalid={error}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onChange={(event) => onChange(parseInt(event.target.value))}
                    min={min}
                    max={max}
                    step={step ?? 1}
                    value={value ?? ""}
                    disabled={disabled}
                />
            </EuiFormRow>
        </div>
    );
}

export default connectField(Num, { kind: "leaf" });
