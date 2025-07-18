/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React from 'react';

import { useTranslations } from 'next-intl';
import { usePydanticFormContext } from 'pydantic-forms';

import { EuiButton, EuiHorizontalRule } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

import { RenderFormErrors } from './RenderFormErrors';

export const Footer = () => {
    const { onCancel, onPrevious, hasNext, formInputData } =
        usePydanticFormContext();

    const { theme } = useOrchestratorTheme();
    const t = useTranslations('pydanticForms.userInputForm');

    const handlePrevious = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const PreviousButton = () => (
        <EuiButton
            data-testid="button-submit-form-previous"
            id="button-submit-form-submit"
            tabIndex={0}
            fill
            onClick={() => {
                if (onPrevious) {
                    onPrevious();
                }
            }}
            color={'primary'}
            iconSide="right"
            aria-label={t('previous')}
        >
            {t('previous')}
        </EuiButton>
    );

    const CancelButton = () => (
        <div
            data-testid="button-submit-form-cancel"
            onClick={handlePrevious}
            css={{
                cursor: 'pointer',
                color: theme.colors.link,
                fontWeight: theme.font.weight.bold,
                marginLeft: theme.base / 2,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {t('cancel')}
        </div>
    );

    const SubmitButton = () => {
        const submitButtonLabel = hasNext ? t('next') : t('startWorkflow');

        /*
         * The submit button is used to submit the form data.
         * If there is a next step, it will be labeled as "Next".
         * If there is no next step, it will be labeled as "Start Workflow".
         * The button is styled with primary color and has an icon on the right side.
         * We don't use the disable property based on the form valid state here. When calculating the form valid state
         * react-hook-form might return a false negative - marking the form invalid - when not all fields have a defaultValue
         * which is a valid use case. https://chatgpt.com/share/6874ce66-35e8-800c-9434-725ff895ac44
         */
        return (
            <EuiButton
                data-testid="button-submit-form-submit"
                id="button-submit-form-submit"
                tabIndex={0}
                fill
                color={'primary'}
                type="submit"
                iconSide="right"
                aria-label={submitButtonLabel}
            >
                {submitButtonLabel}
            </EuiButton>
        );
    };

    return (
        <div data-testid="pydantic-form-footer">
            <RenderFormErrors />
            <EuiHorizontalRule />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    {(formInputData && formInputData.length > 0 && (
                        <PreviousButton />
                    )) || <CancelButton />}
                </div>

                <SubmitButton />
            </div>
        </div>
    );
};
