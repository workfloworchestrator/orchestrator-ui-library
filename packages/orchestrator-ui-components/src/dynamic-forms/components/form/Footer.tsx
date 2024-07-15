/**
 * Dynamic Forms
 *
 * Form footer component
 */
import React from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiFlexGroup,
    EuiHorizontalRule,
    EuiIcon,
} from '@elastic/eui';

import RenderReactHookFormErrors from '@/dynamic-forms/components/render/RenderReactHookFormErrors';
import { useDynamicFormsContext } from '@/dynamic-forms/core';
import { useOrchestratorTheme } from '@/hooks';
import { WfoPlayFill } from '@/icons';

const DynamicFormFooter = () => {
    const {
        // resetForm,
        submitForm,
        theReactHookForm,
        onCancel,
        sendLabel,
        isSending,
    } = useDynamicFormsContext();

    const t = useTranslations('pydanticForms.userInputForm');
    const { theme } = useOrchestratorTheme();
    const hasPrevious = false;
    const hasNext = false;

    return (
        <>
            <EuiHorizontalRule />
            <RenderReactHookFormErrors />
            <>
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
                    <div className="d-flex mv-0 mr-3" style={{ opacity: 0.8 }}>
                        <EuiIcon
                            style={{ opacity: 0.4 }}
                            className="mr-2"
                            size={'m'}
                            type="alert"
                            aria-label="alert"
                        />{' '}
                        Het formulier is nog niet correct ingevuld{' '}
                    </div>
                )}
            </>
            <EuiFlexGroup justifyContent="spaceBetween">
                {(hasPrevious && (
                    <EuiButton
                        id="button-prev-form-submit"
                        fill
                        color={'primary'}
                        onClick={() => {
                            onCancel && onCancel();
                        }}
                    >
                        {t('previous')}
                    </EuiButton>
                )) || (
                    <div
                        onClick={() => {
                            onCancel && onCancel();
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
                )}

                <EuiButton
                    id="button-submit-form-submit"
                    tabIndex={0}
                    fill
                    color={'primary'}
                    isLoading={isSending}
                    type="submit"
                    onClick={(e: any) => {
                        e.preventDefault();
                        submitForm(e);
                    }}
                    iconType={() => <WfoPlayFill color="#FFF" />}
                    iconSide="right"
                >
                    {sendLabel || hasNext ? t('next') : t('submit')}
                </EuiButton>
            </EuiFlexGroup>
        </>
    );
};

export default DynamicFormFooter;
