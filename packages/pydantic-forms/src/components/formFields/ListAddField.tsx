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
import cloneDeep from "lodash/cloneDeep";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connectField, filterDOMProps, joinName, useField } from "uniforms";

export type ListAddFieldProps = FieldProps<string, { initialCount?: number; outerList?: boolean }>;

// onChange not used on purpose
function ListAdd({ disabled, initialCount, name, readOnly, value, outerList = false, ...props }: ListAddFieldProps) {
    const nameParts = joinName(null, name);
    const parentName = joinName(nameParts.slice(0, -1));
    const parent = useField<{ initialCount?: number; maxCount?: number }, unknown[]>(
        parentName,
        { initialCount },
        { absoluteName: true }
    )[0];

    const limitNotReached = !disabled && !(parent.maxCount! <= Math.max(initialCount ?? 0, parent.value!.length));
    const count = 1 + Math.max((initialCount ?? 0) - parent.value!.length, 0);

    function onAction(event: React.KeyboardEvent | React.MouseEvent) {
        if (limitNotReached && !readOnly && (!("key" in event) || event.key === "Enter")) {
            const newRowsValue = Array(count).fill(cloneDeep(value));
            parent.onChange(parent.value!.concat(newRowsValue));
        }
    }

    return (
        <div
            className="add-item"
            {...filterDOMProps(props)}
            onClick={onAction}
            onKeyDown={onAction}
            role="button"
            tabIndex={0}
        >
            <i className={`fa fa-plus ${!limitNotReached || disabled ? "disabled" : ""}`} />
            <label>{outerList && <FormattedMessage id={`forms.fields.${parentName}_add`} />}</label>
        </div>
    );
}

export default connectField(ListAdd, { initialValue: false, kind: "leaf" });
