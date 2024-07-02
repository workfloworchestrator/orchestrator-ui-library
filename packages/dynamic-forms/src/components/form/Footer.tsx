/**
 * Dynamic Forms
 *
 * Form footer component
 */
import React from 'react';
import { FormEvent, useCallback, useState } from 'react';

import { EuiButtonIcon, EuiCard, EuiIcon } from '@elastic/eui';

import RenderReactHookFormErrors from '@/components/render/RenderReactHookFormErrors';
import { useDynamicFormsContext } from '@/core';
import { CsFlags, IsCsFlagEnabled } from '@/utils';

const DynamicFormFooter = () => {
    const { resetForm, submitForm, rhf, onCancel, sendLabel, footerComponent } =
        useDynamicFormsContext();

    const [showErrors, setShowErrors] = useState(false);

    const toggleErrors = useCallback(() => {
        setShowErrors((state) => !state);
        rhf.trigger();
    }, [rhf]);

    const enableInvalidFormSubmission = IsCsFlagEnabled(
        CsFlags.ALLOW_INVALID_FORMS,
    );

    console.log({ footerComponent, showErrors });

    return (
        <div className="form-footer">
            {(!!footerComponent || showErrors) && (
                <EuiCard title="">
                    <>
                        {footerComponent}

                        {showErrors && <RenderReactHookFormErrors />}
                    </>
                </EuiCard>
            )}

            <div className="d-flex">
                <EuiButtonIcon
                    iconType="smile"
                    type="button"
                    onClick={() => resetForm}
                    disabled={!rhf.formState.isDirty}
                >
                    Rubriekinhoud herstellen
                </EuiButtonIcon>

                <span className="spacer"></span>

                <div className="d-flex align-items-center">
                    {rhf.formState.isValid && !rhf.formState.isDirty && (
                        <div
                            className="d-flex mv-0 mr-3"
                            style={{ opacity: 0.8 }}
                        >
                            Het formulier is nog niet aangepast
                        </div>
                    )}

                    {!rhf.formState.isValid && (
                        <div
                            className="d-flex mv-0 mr-3"
                            style={{ opacity: 0.8 }}
                        >
                            <EuiIcon
                                style={{ opacity: 0.4 }}
                                className="mr-2"
                                size={'m'}
                                type="alert"
                            />{' '}
                            Het formulier is nog niet correct ingevuld{' '}
                            {!showErrors && (
                                <>
                                    -{' '}
                                    <a
                                        className="ml-1 font-weight-bold"
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleErrors();
                                        }}
                                    >
                                        Toon info
                                    </a>
                                </>
                            )}
                        </div>
                    )}

                    {!!onCancel && (
                        <EuiButtonIcon
                            type="button"
                            iconType={'arrow'}
                            onClick={onCancel}
                        >
                            Annuleren
                        </EuiButtonIcon>
                    )}

                    <EuiButtonIcon
                        type="submit"
                        onClick={() =>
                            submitForm({} as FormEvent<HTMLFormElement>)
                        }
                        iconType={'arrow'}
                        disabled={
                            !enableInvalidFormSubmission &&
                            (!rhf.formState.isValid ||
                                (!rhf.formState.isDirty &&
                                    !rhf.formState.isSubmitting))
                        }
                    >
                        {sendLabel ? sendLabel : 'Verzenden'}
                    </EuiButtonIcon>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormFooter;
