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

export type ErrorFieldProps = FieldProps<null>;

// onChange not used on purpose
function Error({ children, onChange, error, errorMessage, ...props }: ErrorFieldProps) {
    return !error ? null : <div {...filterDOMProps(props)}>{children || errorMessage}</div>;
}

export default connectField(Error, { initialValue: false, kind: "leaf" });
