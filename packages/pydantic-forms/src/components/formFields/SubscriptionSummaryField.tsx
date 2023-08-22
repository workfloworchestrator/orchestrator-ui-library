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

import { EuiFormRow, EuiText } from "@elastic/eui";
import SubscriptionDetail from "components/subscriptionDetail/SubscriptionDetail";
import { FieldProps } from "lib/uniforms-surfnet/src/types";
import React from "react";
import { connectField, filterDOMProps } from "uniforms";

export type SubscriptionSummaryFieldProps = FieldProps<string>;
function SubscriptionSummary({
    id,
    name,
    label,
    description,
    onChange, // Not used on purpose
    value,
    ...props
}: SubscriptionSummaryFieldProps) {
    if (!value) {
        return null;
    }

    return (
        <section {...filterDOMProps(props)}>
            <EuiFormRow label={label} labelAppend={<EuiText size="m">{description}</EuiText>} id={id} fullWidth>
                <SubscriptionDetail subscriptionId={value} />
            </EuiFormRow>
        </section>
    );
}

export default connectField(SubscriptionSummary, { kind: "leaf" });
