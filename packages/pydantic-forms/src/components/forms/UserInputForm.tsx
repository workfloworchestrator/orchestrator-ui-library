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

import { ButtonColor, EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { SubscriptionsContextProvider } from "components/subscriptionContext";
import ConfirmationDialogContext from "contextProviders/ConfirmationDialogProvider";
import { autoFieldFunction } from "custom/uniforms/AutoFieldLoader";
import invariant from "invariant";
import { JSONSchema6 } from "json-schema";
import { AutoFields } from "lib/uniforms-surfnet/src";
import { intl } from "locale/i18n";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import React, { useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { filterDOMProps, joinName } from "uniforms";
import { JSONSchemaBridge } from "uniforms-bridge-json-schema";
import { AutoField, AutoForm } from "uniforms-unstyled";
import { getQueryParameters } from "utils/QueryParameters";
import { ValidationError } from "utils/types";

import { userInputFormStyling } from "./UserInputFormStyling";

type JSONSchemaFormProperty = JSONSchema6 & { uniforms: any; defaultValue: any };

interface IProps extends RouteComponentProps {
    stepUserInput: JSONSchema6;
    validSubmit: (userInput: { [index: string]: any }) => Promise<void>;
    cancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
    previous: (e: React.MouseEvent<HTMLButtonElement>) => void;
    hasNext?: boolean;
    hasPrev?: boolean;
    userInput: {};
}

interface Buttons {
    previous: {
        text?: string;
        dialog?: string;
        color?: ButtonColor;
    };
    next: {
        text?: string;
        dialog?: string;
        color?: ButtonColor;
    };
}

declare module "uniforms" {
    interface FilterDOMProps {
        customPropToFilter: never;
        description: never;
        const: never;
        default: never;
        required: never;
        pattern: never;
        examples: never;
        allOf: never;
        options: never;
    }
}
filterDOMProps.register("description");
filterDOMProps.register("const");
filterDOMProps.register("default");
filterDOMProps.register("required");
filterDOMProps.register("pattern");
filterDOMProps.register("examples");
filterDOMProps.register("allOf");
filterDOMProps.register("options");

function resolveRef(reference: string, schema: Record<string, any>) {
    invariant(
        reference.startsWith("#"),
        'Reference is not an internal reference, and only such are allowed: "%s"',
        reference
    );

    const resolvedReference = reference
        .split("/")
        .filter((part) => part && part !== "#")
        .reduce((definition, next) => definition[next], schema);

    invariant(resolvedReference, 'Reference not found in schema: "%s"', reference);

    return resolvedReference;
}
class CustomTitleJSONSchemaBridge extends JSONSchemaBridge {
    // This a copy of the super class function to provide a fix for https://github.com/vazco/uniforms/issues/863
    getField(name: string) {
        return joinName(null, name).reduce((definition, next, nextIndex, array) => {
            const previous = joinName(array.slice(0, nextIndex));
            const isRequired = get(
                definition,
                "required",
                get(this._compiledSchema, [previous, "required"], [])
            ).includes(next);

            const _key = joinName(previous, next);
            const _definition = this._compiledSchema[_key] || {};

            if (next === "$" || next === "" + parseInt(next, 10)) {
                invariant(definition.type === "array", 'Field not found in schema: "%s"', name);
                definition = Array.isArray(definition.items) ? definition.items[parseInt(next, 10)] : definition.items;
            } else if (definition.type === "object") {
                invariant(definition.properties, 'Field properties not found in schema: "%s"', name);
                definition = definition.properties[next];
            } else {
                const [{ properties: combinedDefinition = {} } = {}] = ["allOf", "anyOf", "oneOf"]
                    .filter((key) => definition[key])
                    .map((key) => {
                        // FIXME: Correct type for `definition`.
                        const localDef = (definition[key] as any[]).map((subSchema) =>
                            subSchema.$ref ? resolveRef(subSchema.$ref, this.schema) : subSchema
                        );
                        return localDef.find(({ properties = {} }) => properties[next]);
                    });

                definition = combinedDefinition[next];
            }

            invariant(definition, 'Field not found in schema: "%s"', name);

            if (definition.$ref) {
                definition = resolveRef(definition.$ref, this.schema);
            }

            ["allOf", "anyOf", "oneOf"].forEach((key) => {
                if (definition[key]) {
                    // FIXME: Correct type for `definition`.
                    _definition[key] = (definition[key] as any[]).map((def) =>
                        def.$ref ? resolveRef(def.$ref, this.schema) : def
                    );
                }
            });

            // Naive computation of combined type, properties and required
            const combinedPartials: any[] = []
                .concat(_definition.allOf, _definition.anyOf, _definition.oneOf)
                .filter(Boolean);

            if (combinedPartials.length) {
                const localProperties = definition.properties ? { ...definition.properties } : {};
                const localRequired = definition.required ? definition.required.slice() : [];

                combinedPartials.forEach((combinedPartial) => {
                    const { properties, required } = combinedPartial;
                    if (properties) {
                        Object.assign(localProperties, properties);
                    }
                    if (required) {
                        localRequired.push(...required);
                    }

                    // Copy all properties instead of only type
                    for (const key in combinedPartial) {
                        if (combinedPartial[key] && !_definition[key]) {
                            _definition[key] = combinedPartial[key];
                            definition[key] = combinedPartial[key];
                        }
                    }
                });

                if (Object.keys(localProperties).length > 0) {
                    _definition.properties = localProperties;
                }
                if (localRequired.length > 0) {
                    _definition.required = localRequired;
                }
            }

            this._compiledSchema[_key] = Object.assign(_definition, { isRequired });

            return definition;
        }, this.schema);
    }

    getProps(name: string) {
        let props = super.getProps(name);
        const translation_key = name.replace(/\.\d+(.\d+)*/, "_fields");
        const translation_intl_key = `forms.fields.${translation_key}`;
        const translation = intl.formatMessage({ id: translation_intl_key, defaultMessage: translation_intl_key });
        let label = translation !== translation_intl_key ? translation : props.label;

        // Mark required inputs. Might be delegated to the form components itself in the future.
        if (props.required && !props.readOnly && !props.isDisabled && !name.includes(".")) {
            label = `${label} *`;
        }

        props.label = label;
        props.description = intl.formatMessage({ id: `forms.fields.${translation_key}_info`, defaultMessage: " " }); // Default must contain a space as not to be Falsy
        props.id = `input-${name}`;

        if (props.const) {
            props.disabled = true;
            props.default = props.const;
            delete props["const"];
        }

        if (props.initialCount === undefined) {
            props.initialCount = props.minCount;
        }

        return props;
    }

    getInitialValue(name: string, props: Record<string, any> = {}): any {
        const { default: _default, const: _const, type: _type } = this.getField(name);
        let {
            default: defaultValue = _default !== undefined ? _default : get(this.schema.default, name),
            const: constValue = _const,
            type = _type,
            // @ts-ignore
        } = this._compiledSchema[name];

        // use const if present
        if (defaultValue === undefined) defaultValue = constValue;

        // See https://github.com/vazco/uniforms/issues/749
        if (defaultValue === undefined) {
            const nameArray = joinName(null, name);
            const relativeName = nameArray.pop()!;
            const parentName = joinName(nameArray);
            if (parentName !== "") {
                const model = this.getInitialValue(parentName, { lookUpParent: true });
                defaultValue = get(model, relativeName);
            }
        }

        if (defaultValue !== undefined) return cloneDeep(defaultValue);

        if (type === "array" && !props.lookUpParent && !name.endsWith("$")) {
            const item = this.getInitialValue(joinName(name, "0"));
            const items = props.initialCount || 0;
            return Array(items).fill(item);
        }

        if (type === "object") {
            return {};
        }
        return undefined;
    }
}

function fillPreselection(form: JSONSchema6, query: string) {
    const queryParams = getQueryParameters(query);

    if (form && form.properties) {
        Object.keys(queryParams).forEach((param) => {
            if (form && form.properties && form.properties[param]) {
                const organisatieInput = form.properties[param] as JSONSchemaFormProperty;
                if (!organisatieInput.uniforms) {
                    organisatieInput.uniforms = {};
                }
                organisatieInput.uniforms.disabled = true;
                organisatieInput.default = queryParams[param];
            }
        });

        // ipvany preselect
        if (queryParams.prefix && queryParams.prefixlen) {
            if (form && form.properties.ip_prefix) {
                const ipPrefixInput = form.properties.ip_prefix as JSONSchemaFormProperty;
                if (!ipPrefixInput.uniforms) {
                    ipPrefixInput.uniforms = {};
                }
                ipPrefixInput.default = `${queryParams.prefix}/${queryParams.prefixlen}`;
                ipPrefixInput.uniforms.prefixMin = parseInt(
                    (queryParams.prefix_min as string) ?? (queryParams.prefixlen as string),
                    10
                );
            }
        }
    }
    return form;
}
function UserInputForm({
    stepUserInput,
    validSubmit,
    cancel,
    previous = () => {},
    hasNext = false,
    hasPrev = false,
    userInput,
    location,
}: IProps) {
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);
    const [processing, setProcessing] = useState<boolean>(false);
    const [nrOfValidationErrors, setNrOfValidationErrors] = useState<number>(0);
    const [rootErrors, setRootErrors] = useState<string[]>([]);

    const openDialog = (e: React.FormEvent) => {
        showConfirmDialog({
            question: "",
            confirmAction: () => {},
            cancelAction: cancel,
            leavePage: true,
        });
    };

    const submit = async (userInput: any = {}) => {
        if (!processing) {
            setProcessing(true);

            try {
                await validSubmit(userInput);
                setProcessing(false);
                return null;
            } catch (error) {
                setProcessing(false);

                // @ts-ignore
                if (error.response.status === 400) {
                    // @ts-ignore
                    let json = error.response.data;
                    setNrOfValidationErrors(json.validation_errors.length);
                    setRootErrors(
                        json.validation_errors
                            .filter((e: ValidationError) => e.loc[0] === "__root__")
                            .map((e: ValidationError) => e.msg)
                    );
                    throw Object.assign(new Error(), {
                        details: json.validation_errors.map((e: ValidationError) => ({
                            message: e.msg,
                            params: e.ctx || {},
                            dataPath: "." + e.loc.join("."),
                        })),
                    });
                }

                // Let the error escape so it can be caught by our own onerror handler instead of being silenced by uniforms
                setTimeout(() => {
                    throw error;
                }, 0);

                // The form will clear the errors so also remove the warning
                setNrOfValidationErrors(0);
                setRootErrors([]);

                // The error we got contains no validation errors so don't send it to uniforms
                return null;
            }
        }
    };

    const onButtonClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        question: string | undefined,
        confirm: (e: React.MouseEvent<HTMLButtonElement>) => void
    ) => {
        if (!question) {
            return confirm(e);
        }

        showConfirmDialog({
            question: question,
            confirmAction: confirm,
            cancelAction: () => {},
            leavePage: false,
        });
    };

    const renderButtons = (buttons: Buttons) => {
        const prevButton = hasPrev ? (
            <EuiButton
                id="button-prev-form-submit"
                fill
                color={buttons.previous.color ?? "primary"}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    onButtonClick(e, buttons.previous.dialog, previous);
                }}
            >
                {buttons.previous.text ?? <FormattedMessage id="process.previous" />}
            </EuiButton>
        ) : (
            <EuiFlexItem>
                <EuiButton
                    id="button-cancel-form-submit"
                    color={buttons.previous.color ?? "warning"}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        onButtonClick(e, buttons.previous.dialog, openDialog);
                    }}
                >
                    {buttons.previous.text ?? <FormattedMessage id="process.cancel" />}
                </EuiButton>
            </EuiFlexItem>
        );

        const nextButton = hasNext ? (
            <EuiButton
                id="button-next-form-submit"
                tabIndex={0}
                fill
                color={buttons.next.color ?? "primary"}
                isLoading={processing}
                type="submit"
            >
                {buttons.next.text ?? <FormattedMessage id="process.next" />}
            </EuiButton>
        ) : (
            <EuiButton
                id="button-submit-form-submit"
                tabIndex={0}
                fill
                color={buttons.next.color ?? "primary"}
                isLoading={processing}
                type="submit"
            >
                {buttons.next.text ?? <FormattedMessage id="process.submit" />}
            </EuiButton>
        );

        return (
            <EuiFlexGroup className="buttons">
                <EuiFlexItem>{prevButton}</EuiFlexItem>
                <EuiFlexItem>{nextButton}</EuiFlexItem>
            </EuiFlexGroup>
        );
    };

    const prefilledForm = fillPreselection(stepUserInput, location.search);
    const bridge = new CustomTitleJSONSchemaBridge(prefilledForm, () => {});
    const AutoFieldProvider = AutoField.componentDetectorContext.Provider;
    // @ts-ignore Get the Button config from the form default values, or default to empty config
    const buttons: Buttons = stepUserInput.properties?.buttons?.default ?? { previous: {}, next: {} };

    return (
        <EuiPanel css={userInputFormStyling}>
            <div className="user-input-form">
                <section className="form-fieldset">
                    {stepUserInput.title && stepUserInput.title !== "unknown" && <h3>{stepUserInput.title}</h3>}
                    <SubscriptionsContextProvider>
                        {/*
                            // @ts-ignore */}
                        <AutoFieldProvider value={autoFieldFunction}>
                            <AutoForm
                                schema={bridge}
                                onSubmit={submit}
                                showInlineError={true}
                                validate="onSubmit"
                                model={userInput}
                            >
                                <AutoFields omitFields={["buttons"]} />
                                {/* Show top level validation info about backend validation */}
                                {nrOfValidationErrors > 0 && (
                                    <section className="form-errors">
                                        <em className="error backend-validation-metadata">
                                            <FormattedMessage
                                                id="process.input_fields_have_validation_errors"
                                                values={{ nrOfValidationErrors: nrOfValidationErrors }}
                                            />
                                        </em>
                                    </section>
                                )}
                                {rootErrors.length > 0 && (
                                    <section className="form-errors">
                                        <em className="error backend-validation-metadata">
                                            {rootErrors.map((error) => (
                                                <div className="euiFormErrorText euiFormRow__text">{error}</div>
                                            ))}
                                        </em>
                                    </section>
                                )}

                                {renderButtons(buttons)}
                            </AutoForm>
                        </AutoFieldProvider>
                    </SubscriptionsContextProvider>
                </section>
            </div>
        </EuiPanel>
    );
}

export default withRouter(UserInputForm);
