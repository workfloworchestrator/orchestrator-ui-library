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

import { EuiDescribedFormGroup, EuiFlexItem, EuiFormRow } from "@elastic/eui";
import { FieldProps } from "lib/uniforms-surfnet/src/types";
import React from "react";
import { useIntl } from "react-intl";
import { connectField, filterDOMProps, useField } from "uniforms";
import { AutoField } from "uniforms-unstyled";

import BoolField from "./BoolField";

export type OptGroupFieldProps = FieldProps<null, { fields?: any[]; itemProps?: object }>;

filterDOMProps.register("properties");

function OptGroup({
    fields,
    itemProps,
    name,
    onChange, // Not used on purpose
    readOnly,
    className = "",
    ...props
}: OptGroupFieldProps) {
    const enabled = useField("enabled", {})[0].value;
    const intl = useIntl();

    return (
        <EuiDescribedFormGroup
            {...filterDOMProps(props)}
            title={<span>{intl.formatMessage({ id: `forms.fields.${name}.title` })}</span>}
            description={intl.formatMessage({ id: `forms.fields.${name}.info` })}
            className={`${className} optgroup-field`}
        >
            <>
                <EuiFlexItem>
                    <EuiFormRow
                        error={false}
                        isInvalid={false}
                        id={name} // Not sure if this is always unique...
                    >
                        <BoolField name="enabled" readOnly={readOnly} />
                    </EuiFormRow>
                </EuiFlexItem>
                {enabled &&
                    fields
                        ?.filter((field) => field !== "enabled")
                        .map((field) => (
                            <EuiFlexItem key={field}>
                                <AutoField name={field} {...itemProps} />
                            </EuiFlexItem>
                        ))}
            </>
        </EuiDescribedFormGroup>
    );
}

export default connectField(OptGroup);
