/**
 * Dynamic Forms
 *
 * Form footer component
 */
import React from 'react';
import { FormEvent, useCallback, useState } from 'react';

import { EuiButtonIcon, EuiCard, EuiIcon } from '@elastic/eui';

import RenderReactHookFormErrors from '@/dynamic-forms/components/render/RenderReactHookFormErrors';
import { useDynamicFormsContext } from '@/dynamic-forms/core';
import { CsFlags, IsCsFlagEnabled } from '@/dynamic-forms/utils';

const DynamicFormFooter = () => {
    const {
        resetForm,
        submitForm,
        theReactHookForm,
        onCancel,
        sendLabel,
        footerComponent,
    } = useDynamicFormsContext();

    const [showErrors, setShowErrors] = useState(false);

    const toggleErrors = useCallback(() => {
        setShowErrors((state) => !state);
        theReactHookForm.trigger();
    }, [theReactHookForm]);

    const enableInvalidFormSubmission = IsCsFlagEnabled(
        CsFlags.ALLOW_INVALID_FORMS,
    );

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
                    iconType="returnKey"
                    aria-label="returnKey"
                    type="button"
                    onClick={() => resetForm}
                    disabled={!theReactHookForm.formState.isDirty}
                >
                    Rubriekinhoud herstellen
                </EuiButtonIcon>

                <span className="spacer"></span>

                <div className="d-flex align-items-center">
                    {theReactHookForm.formState.isValid &&
                        !theReactHookForm.formState.isDirty && (
                            <div
                                className="d-flex mv-0 mr-3"
                                style={{ opacity: 0.8 }}
                            >
                                Het formulier is nog niet aangepast
                            </div>
                        )}

                    {!theReactHookForm.formState.isValid && (
                        <div
                            className="d-flex mv-0 mr-3"
                            style={{ opacity: 0.8 }}
                        >
                            <EuiIcon
                                style={{ opacity: 0.4 }}
                                className="mr-2"
                                size={'m'}
                                type="alert"
                                aria-label="alert"
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
                            iconType="arrowLeft"
                            aria-label="arrowLeft"
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
                        iconType="bell"
                        aria-label="bell"
                        disabled={
                            !enableInvalidFormSubmission &&
                            (!theReactHookForm.formState.isValid ||
                                (!theReactHookForm.formState.isDirty &&
                                    !theReactHookForm.formState.isSubmitting))
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
