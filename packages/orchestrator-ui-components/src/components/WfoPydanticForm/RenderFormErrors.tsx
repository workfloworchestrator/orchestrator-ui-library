/**
 * Pydantic Forms
 *
 * Renders errors that are generated client-side
 */
import React from 'react';

import { useTranslations } from 'next-intl';
import { useGetValidationErrors } from 'pydantic-forms';

import { useWithOrchestratorTheme } from '@/hooks';

import { getCommonFormFieldStyles } from './fields/styles';

export const RenderFormErrors = () => {
    const { errorStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    const errorDetails = useGetValidationErrors();
    const t = useTranslations('pydanticForms.userInputForm');
    if (!errorDetails) {
        return <></>;
    }

    const errors = errorDetails.source;
    const rootError = errors
        .filter((err) => err.loc.includes('__root__'))
        .shift();
    const otherErrors = errors.filter((err) => !err.loc.includes('__root__'));

    return (
        <em css={errorStyle}>
            {rootError && <div>{rootError.msg}</div>}
            {otherErrors?.length >= 1 &&
                t('inputFieldsHaveValidationErrors', {
                    nrOfValidationErrors: otherErrors.length,
                })}
        </em>
    );
};
