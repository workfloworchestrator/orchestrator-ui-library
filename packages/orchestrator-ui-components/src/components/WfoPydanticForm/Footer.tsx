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
import { WfoPlayFill } from '@/icons';

export const Footer = () => {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('pydanticForms.userInputForm');
    const { rhf, onCancel, allowUntouchedSubmit, isLoading } =
        usePydanticFormContext();

    return (
        <div>
            <EuiHorizontalRule />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                    onClick={() => {
                        if (onCancel) {
                            onCancel();
                        }
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
                    {t('cancel')}
                </div>

                <EuiButton
                    id="button-submit-form-submit"
                    tabIndex={0}
                    fill
                    color={'primary'}
                    isLoading={isLoading}
                    type="submit"
                    iconType={() => <WfoPlayFill color="#FFF" />}
                    iconSide="right"
                    disabled={
                        !rhf.formState.isValid ||
                        (!allowUntouchedSubmit &&
                            !rhf.formState.isDirty &&
                            !rhf.formState.isSubmitting)
                    }
                >
                    {t('startWorkflow')}
                </EuiButton>
            </div>
        </div>
    );
};
