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

import { EuiCheckbox, EuiFlexItem, EuiText } from "@elastic/eui";
import { FieldProps } from "lib/uniforms-surfnet/src/types";
import React, { useReducer } from "react";
import { FormattedMessage } from "react-intl";
import { connectField, filterDOMProps } from "uniforms";

import { acceptFieldStyling } from "./AcceptFieldStyling";

type AcceptItemType =
    | "info"
    | "label"
    | "warning"
    | "url"
    | "checkbox"
    | ">checkbox"
    | "checkbox?"
    | ">checkbox?"
    | "skip"
    | "margin"
    | "value";
type AcceptItem = [string, AcceptItemType, Record<string, string>?];
type AcceptValue = "SKIPPED" | "ACCEPTED" | "INCOMPLETE";

export type AcceptFieldProps = FieldProps<AcceptValue, { data?: AcceptItem[] }>;

declare module "uniforms" {
    interface FilterDOMProps {
        data: never;
    }
}

filterDOMProps.register("data");

interface AcceptState {
    checks: { [index: number]: boolean };
    skip: boolean;
    allChecked: boolean;
}

interface Action {
    field: number;
    type: string;
    value: boolean;
}

function Accept({
    disabled,
    className = "",
    name,
    onChange,
    value,
    error,
    showInlineError,
    errorMessage,
    data,
    ...props
}: AcceptFieldProps) {
    const legacy = !data;
    const i18nBaseKey = data ? `forms.fields.${name}_accept` : "forms.fields";

    data = data ?? [
        [name, "label", {}],
        [`${name}_info`, "info", {}],
        [name, "checkbox", {}],
    ];

    let [state, dispatch] = useReducer(
        (state: AcceptState, action: Action) => {
            if (action.type === "skip") {
                state.skip = action.value;
                state.checks = {};
            } else {
                state.checks[action.field] = action.value;
            }

            // We intentionally skip optional checkboxes here
            state.allChecked = data!
                .map(
                    (entry: AcceptItem, index: number) => [entry, state.checks[index] || false] as [AcceptItem, boolean]
                )
                .filter((entry: [AcceptItem, boolean]) => entry[0][1].endsWith("checkbox"))
                .map((entry: [AcceptItem, boolean]) => entry[1])
                .every((check: boolean) => check);

            onChange(state.skip ? "SKIPPED" : state.allChecked ? "ACCEPTED" : "INCOMPLETE");

            return { ...state };
        },
        { checks: {}, skip: false, allChecked: false }
    );

    return (
        <EuiFlexItem css={acceptFieldStyling}>
            <section {...filterDOMProps(props)} className={`${className} accept-field`}>
                {data.map((entry: any[], index: number) => {
                    const label = <FormattedMessage id={`${i18nBaseKey}.${entry[0]}`} values={entry[2]} />;
                    switch (entry[1]) {
                        case "label":
                            return (
                                <label key={index} className="euiFormLabel euiFormRow__label">
                                    {label}
                                </label>
                            );
                        case "info":
                            return (
                                <EuiText key={index} size="m">
                                    {label}
                                </EuiText>
                            );
                        case "url":
                            return (
                                <div key={index}>
                                    <a href={entry[0]} target="_blank" rel="noopener noreferrer">
                                        {entry[0]}
                                    </a>
                                </div>
                            );
                        case "value":
                            return (
                                <div key={index}>
                                    <input value={entry[0]} disabled={true} />
                                </div>
                            );
                        case "margin":
                            return <br key={index} />;
                        case "warning":
                            return (
                                <label key={index} className="euiFormLabel euiFormRow__label warning">
                                    {label}
                                </label>
                            );
                        case "skip":
                            return (
                                <EuiCheckbox
                                    id={entry[0]}
                                    key={index}
                                    name={entry[0]}
                                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        const target = e.target as HTMLInputElement;
                                        dispatch({ field: index, type: "skip", value: target.checked });
                                    }}
                                    checked={state.skip}
                                    label={label}
                                    className={"skip"}
                                />
                            );
                        default:
                            return (
                                <EuiCheckbox
                                    id={entry[0] + (legacy ? "" : index)}
                                    key={index}
                                    name={entry[0] + (legacy ? "" : index)} // Index needed to allow checkboxes with same name (we can skip this in legacy mode)
                                    className={entry[1].startsWith(">") ? "level_2" : undefined}
                                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        const target = e.target as HTMLInputElement;

                                        dispatch({ field: index, type: "check", value: target.checked });
                                    }}
                                    checked={state.checks[index]}
                                    label={label}
                                    readOnly={state.skip || disabled}
                                />
                            );
                    }
                })}

                {error && showInlineError && (
                    <em className="error">
                        <div className="backend-validation">{errorMessage}</div>
                    </em>
                )}
            </section>
        </EuiFlexItem>
    );
}

export default connectField(Accept);
