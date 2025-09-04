import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiHorizontalRule } from '@elastic/eui';

import { RenderFormErrors } from '@/components/WfoPydanticForm/RenderFormErrors';
import { WfoPlayCircle } from '@/icons';

interface StepFormFooterProps {
    isTask: boolean;
    isResumeAllowed?: boolean;
}

export const StepFormFooter = ({
    isTask,
    isResumeAllowed,
}: StepFormFooterProps) => {
    const t = useTranslations('pydanticForms.userInputForm');

    const SubmitButton = () => {
        const submitButtonLabel = isTask
            ? t('resumeTask')
            : t('resumeWorkflow');
        return (
            <EuiButton
                data-testid="button-submit-form-submit"
                id="button-submit-form-submit"
                tabIndex={0}
                fill
                color="primary"
                iconType={() => (
                    <WfoPlayCircle
                        color={'currentColor'}
                        width="18"
                        height="18"
                    />
                )}
                iconSide="right"
                aria-label={submitButtonLabel}
                disabled={!isResumeAllowed}
            >
                {submitButtonLabel}
            </EuiButton>
        );
    };

    return (
        <div data-testid="pydantic-form-footer">
            <RenderFormErrors />
            <EuiHorizontalRule />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SubmitButton />
            </div>
        </div>
    );
};
