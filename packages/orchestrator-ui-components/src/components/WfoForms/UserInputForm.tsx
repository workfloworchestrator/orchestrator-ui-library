/* eslint-disable @typescript-eslint/no-explicit-any */

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
import React, { useContext, useState } from 'react';

import axios from 'axios';
import invariant from 'invariant';
import { JSONSchema6 } from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { useTranslations } from 'next-intl';
import { NextRouter } from 'next/router';
import { filterDOMProps, joinName } from 'uniforms';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { AutoField, AutoForm } from 'uniforms-unstyled';

import {
    EuiButton,
    EuiButtonColor,
    EuiFlexGroup,
    EuiHorizontalRule,
} from '@elastic/eui';

import { ConfirmDialogActions, ConfirmationDialogContext } from '@/contexts';
import { useOrchestratorTheme } from '@/hooks';
import { WfoPlayFill } from '@/icons';
import { ValidationError } from '@/types/forms';

import { autoFieldFunction } from './AutoFieldLoader';
import AutoFields from './AutoFields';
import { userInputFormStyling } from './UserInputFormStyling';

type UniformJSONSchemaProperty = JSONSchema6 & {
    uniforms: any;
    defaultValue: any;
};

interface IProps {
    router: NextRouter;
    stepUserInput: JSONSchema6;
    validSubmit: (userInput: { [index: string]: unknown }) => Promise<unknown>;
    cancel?: ConfirmDialogActions['closeConfirmDialog'];
    previous: ConfirmDialogActions['closeConfirmDialog'];
    hasNext?: boolean;
    hasPrev?: boolean;
    userInput: object;
    isTask?: boolean;
    isResume?: boolean;
}

interface Buttons {
    previous: {
        text?: string;
        dialog?: string;
        color?: EuiButtonColor;
    };
    next: {
        text?: string;
        dialog?: string;
        color?: EuiButtonColor;
    };
}

declare module 'uniforms' {
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
filterDOMProps.register('description');
filterDOMProps.register('const');
filterDOMProps.register('default');
filterDOMProps.register('required');
filterDOMProps.register('pattern');
filterDOMProps.register('examples');
filterDOMProps.register('allOf');
filterDOMProps.register('options');

function resolveRef(reference: string, schema: Record<string, any>) {
    invariant(
        reference.startsWith('#'),
        'Reference is not an internal reference, and only such are allowed: "%s"',
        reference,
    );

    const resolvedReference = reference
        .split('/')
        .filter((part) => part && part !== '#')
        .reduce((definition, next) => definition[next], schema);

    invariant(
        resolvedReference,
        'Reference not found in schema: "%s"',
        reference,
    );

    return resolvedReference;
}

class CustomTitleJSONSchemaBridge extends JSONSchemaBridge {
    t: any;

    constructor(schema: JSONSchema6, validator: any, t: any) {
        super(schema, validator);
        this.t = t;
    }

    translationKeyExists(key: string): boolean {
        const translation = this.t(key);
        return translation !== key ? true : false;
    }

    // This a copy of the super class function to provide a fix for https://github.com/vazco/uniforms/issues/863
    getField(name: string) {
        return joinName(null, name).reduce(
            (definition, next, nextIndex, array) => {
                const previous = joinName(array.slice(0, nextIndex));
                const isRequired = get(
                    definition,
                    'required',
                    get(this._compiledSchema, [previous, 'required'], []),
                ).includes(next);

                const _key = joinName(previous, next);
                const _definition = this._compiledSchema[_key] || {};

                if (next === '$' || next === '' + parseInt(next, 10)) {
                    invariant(
                        definition.type === 'array',
                        'Field not found in schema: "%s"',
                        name,
                    );
                    definition = Array.isArray(definition.items)
                        ? definition.items[parseInt(next, 10)]
                        : definition.items;
                } else if (definition.type === 'object') {
                    invariant(
                        definition.properties,
                        'Field properties not found in schema: "%s"',
                        name,
                    );
                    definition = definition.properties[next];
                } else {
                    const [{ properties: combinedDefinition = {} } = {}] = [
                        'allOf',
                        'anyOf',
                        'oneOf',
                    ]
                        .filter((key) => definition[key])
                        .map((key) => {
                            // FIXME: Correct type for `definition`.
                            const localDef = (definition[key] as any[]).map(
                                (subSchema) =>
                                    subSchema.$ref
                                        ? resolveRef(
                                              subSchema.$ref,
                                              this.schema,
                                          )
                                        : subSchema,
                            );
                            return localDef.find(
                                ({ properties = {} }) => properties[next],
                            );
                        });

                    definition = combinedDefinition[next];
                }

                invariant(definition, 'Field not found in schema: "%s"', name);

                if (definition.$ref) {
                    definition = resolveRef(definition.$ref, this.schema);
                }

                ['allOf', 'anyOf', 'oneOf'].forEach((key) => {
                    if (definition[key]) {
                        // FIXME: Correct type for `definition`.
                        _definition[key] = (definition[key] as any[]).map(
                            (def) =>
                                def.$ref
                                    ? resolveRef(def.$ref, this.schema)
                                    : def,
                        );
                    }
                });

                // Naive computation of combined type, properties and required
                const combinedPartials: any[] = []
                    .concat(
                        _definition.allOf,
                        _definition.anyOf,
                        _definition.oneOf,
                    )
                    .filter(Boolean);

                if (combinedPartials.length) {
                    const localProperties = definition.properties
                        ? { ...definition.properties }
                        : {};
                    const localRequired = definition.required
                        ? definition.required.slice()
                        : [];

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

                this._compiledSchema[_key] = Object.assign(_definition, {
                    isRequired,
                });

                return definition;
            },
            this.schema,
        );
    }

    getProps(name: string) {
        const props = super.getProps(name);

        const translationKey = name.replace(/\.\d+(.\d+)*/, '_fields'); // This is evaluates to name or name_fields
        const nextIntlKey = `pydanticForms.backendTranslations.${translationKey}`;
        let label = this.translationKeyExists(nextIntlKey)
            ? this.t(nextIntlKey)
            : props.label;

        // Mark required inputs. Might be delegated to the form components itself in the future.
        if (
            props.required &&
            !props.readOnly &&
            !props.isDisabled &&
            !name.includes('.')
        ) {
            label = `${label} *`;
        }

        props.label = label;

        const descriptionTranslationKey = `pydanticForms.backendTranslations.${translationKey}_info`;
        props.description = this.translationKeyExists(descriptionTranslationKey)
            ? this.t(descriptionTranslationKey)
            : ' ';

        props.id = `input-${name}`;

        if (props.const) {
            props.disabled = true;
            props.default = props.const;
            delete props['const'];
        }

        if (props.initialCount === undefined) {
            props.initialCount = props.minCount;
        }

        return props;
    }

    getInitialValue(name: string, props: Record<string, any> = {}): any {
        const {
            default: _default,
            const: _const,
            type: _type,
        } = this.getField(name);
        let {
            default: defaultValue = _default !== undefined
                ? _default
                : get(this.schema.default, name),
        } = this._compiledSchema[name];
        const { const: constValue = _const, type = _type } =
            this._compiledSchema[name];

        // use const if present
        if (defaultValue === undefined) defaultValue = constValue;

        // See https://github.com/vazco/uniforms/issues/749
        if (defaultValue === undefined) {
            const nameArray = joinName(null, name);
            const relativeName = nameArray.pop()!;
            const parentName = joinName(nameArray);
            if (parentName !== '') {
                const model = this.getInitialValue(parentName, {
                    lookUpParent: true,
                });
                defaultValue = get(model, relativeName);
            }
        }

        if (defaultValue !== undefined) return cloneDeep(defaultValue);

        if (type === 'array' && !props.lookUpParent && !name.endsWith('$')) {
            const item = this.getInitialValue(joinName(name, '0'));
            const items = props.initialCount || 0;
            return Array(items).fill(item);
        }

        if (type === 'object') {
            return {};
        }
        return undefined;
    }
}

function fillPreselection(form: JSONSchema6, router: NextRouter) {
    const queryParams = router.query;

    if (form && form.properties) {
        Object.keys(queryParams).forEach((param) => {
            if (form && form.properties && form.properties[param]) {
                const organisationInput = form.properties[
                    param
                ] as UniformJSONSchemaProperty;
                if (!organisationInput.uniforms) {
                    organisationInput.uniforms = {};
                }
                organisationInput.uniforms.disabled = true;
                organisationInput.default = queryParams[param];
            }
        });

        // ipvany preselect
        if (queryParams.prefix && queryParams.prefixlen) {
            if (form && form.properties.ip_prefix) {
                const ipPrefixInput = form.properties
                    .ip_prefix as UniformJSONSchemaProperty;
                if (!ipPrefixInput.uniforms) {
                    ipPrefixInput.uniforms = {};
                }
                ipPrefixInput.default = `${queryParams.prefix}/${queryParams.prefixlen}`;
                ipPrefixInput.uniforms.prefixMin = parseInt(
                    (queryParams.prefix_min as string) ??
                        (queryParams.prefixlen as string),
                    10,
                );
            }
        }
    }
    return form;
}

function UserInputForm({
    router,
    stepUserInput,
    validSubmit,
    cancel = () => {},
    previous = () => {},
    hasNext = false,
    hasPrev = false,
    userInput,
    isTask = false,
    isResume = false,
}: IProps) {
    const t = useTranslations('pydanticForms.userInputForm');
    const { theme } = useOrchestratorTheme();
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);
    const [processing, setProcessing] = useState<boolean>(false);
    const [nrOfValidationErrors, setNrOfValidationErrors] = useState<number>(0);
    const [rootErrors, setRootErrors] = useState<string[]>([]);

    const openDialog = () => {
        showConfirmDialog({
            question: '',
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
            } catch (error: unknown) {
                setProcessing(false);

                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 400
                ) {
                    const json = error.response.data;
                    setNrOfValidationErrors(json.validation_errors.length);
                    setRootErrors(
                        json.validation_errors
                            .filter(
                                (e: ValidationError) => e.loc[0] === '__root__',
                            )
                            .map((e: ValidationError) => e.msg),
                    );
                    throw Object.assign(new Error(), {
                        details: json.validation_errors.map(
                            (e: ValidationError) => ({
                                message: e.msg,
                                params: e.ctx || {},
                                dataPath: '.' + e.loc.join('.'),
                            }),
                        ),
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
        e:
            | React.MouseEvent<HTMLButtonElement>
            | React.MouseEvent<HTMLDivElement, MouseEvent>,
        question: string | undefined,
        confirm: ConfirmDialogActions['closeConfirmDialog'],
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
                color={buttons.previous.color ?? 'primary'}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    onButtonClick(e, buttons.previous.dialog, previous);
                }}
            >
                {buttons.previous.text ?? t('previous')}
            </EuiButton>
        ) : !isResume ? (
            <div
                onClick={(e) => {
                    onButtonClick(e, buttons.previous.dialog, openDialog);
                }}
                css={{
                    cursor: 'pointer',
                    color: theme.colors.link,
                    fontWeight: theme.font.weight.bold,
                    marginLeft: '8px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {buttons.previous.text ?? t('cancel')}
            </div>
        ) : (
            <div></div>
        );

        const nextButtonTranslationKey: string = (() => {
            if (isResume) {
                return isTask ? 'resumeTask' : 'resumeWorkflow';
            }
            return isTask ? 'startTask' : 'startWorkflow';
        })();

        const nextButton = hasNext ? (
            <EuiButton
                id="button-next-form-submit"
                tabIndex={0}
                fill
                color={buttons.next.color ?? 'primary'}
                isLoading={processing}
                type="submit"
            >
                {buttons.next.text ?? t('next')}
            </EuiButton>
        ) : (
            <EuiButton
                id="button-submit-form-submit"
                tabIndex={0}
                fill
                color={buttons.next.color ?? 'primary'}
                isLoading={processing}
                type="submit"
                iconType={() => <WfoPlayFill color="#FFF" />}
                iconSide="right"
            >
                {buttons.next.text ?? t(nextButtonTranslationKey)}
            </EuiButton>
        );

        return (
            <>
                <EuiHorizontalRule />

                <EuiFlexGroup justifyContent="spaceBetween">
                    {prevButton}
                    {nextButton}
                </EuiFlexGroup>
            </>
        );
    };

    const prefilledForm = fillPreselection(stepUserInput, router);
    const bridge = new CustomTitleJSONSchemaBridge(
        prefilledForm,
        () => {},
        useTranslations(),
    );
    const AutoFieldProvider = AutoField.componentDetectorContext.Provider;

    // Get the Button config from the form default values, or default to empty config
    const buttonsFromSchema = (prefilledForm.properties?.buttons &&
        prefilledForm.properties?.buttons !== true &&
        prefilledForm.properties?.buttons.default) || {
        previous: {},
        next: {},
    };

    const buttons: Buttons = buttonsFromSchema as unknown as Buttons;

    return (
        <div css={userInputFormStyling}>
            <div className="user-input-form">
                <section className="form-fieldset">
                    {stepUserInput.title &&
                        stepUserInput.title !== 'unknown' && (
                            <h3>{stepUserInput.title}</h3>
                        )}
                    <AutoFieldProvider value={autoFieldFunction}>
                        <AutoForm
                            schema={bridge}
                            onSubmit={submit}
                            showInlineError={true}
                            validate="onSubmit"
                            model={userInput}
                        >
                            <AutoFields omitFields={['buttons']} />
                            {/* Show top level validation info about backend validation */}
                            {nrOfValidationErrors > 0 && (
                                <section className="form-errors">
                                    <em className="error backend-validation-metadata">
                                        {t('inputFieldsHaveValidationErrors', {
                                            nrOfValidationErrors:
                                                nrOfValidationErrors,
                                        })}
                                    </em>
                                </section>
                            )}
                            {rootErrors.length > 0 && (
                                <section className="form-errors">
                                    <em className="error backend-validation-metadata">
                                        {rootErrors.map((error, index) => (
                                            <div
                                                className="euiFormErrorText euiFormRow__text"
                                                key={index}
                                            >
                                                {error}
                                            </div>
                                        ))}
                                    </em>
                                </section>
                            )}

                            {renderButtons(buttons)}
                        </AutoForm>
                    </AutoFieldProvider>
                </section>
            </div>
        </div>
    );
}

export default UserInputForm;
