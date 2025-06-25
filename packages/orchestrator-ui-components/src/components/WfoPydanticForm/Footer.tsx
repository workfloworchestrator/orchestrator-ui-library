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

export const Footer = () => {
    const {
        rhf,
        onCancel,
        onPrevious,
        allowUntouchedSubmit,
        hasNext,
        formInputData,
    } = usePydanticFormContext();

    const { theme } = useOrchestratorTheme();
    const t = useTranslations('pydanticForms.userInputForm');

    const isDisabled: boolean =
        !rhf.formState.isValid ||
        (!allowUntouchedSubmit &&
            !rhf.formState.isDirty &&
            !rhf.formState.isSubmitting);

    const handlePrevious = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const PreviousButton = () => (
        <EuiButton
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

        return (
            <EuiButton
                id="button-submit-form-submit"
                tabIndex={0}
                fill
                color={'primary'}
                type="submit"
                iconSide="right"
                aria-label={submitButtonLabel}
                disabled={isDisabled}
            >
                {submitButtonLabel}
            </EuiButton>
        );
    };

    return (
        <div>
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
