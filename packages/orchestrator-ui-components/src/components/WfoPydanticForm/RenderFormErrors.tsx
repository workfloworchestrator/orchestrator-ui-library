/**
 * Pydantic Forms
 *
 * Renders errors that are generated client-side
 */
import React from 'react';

import { useTranslations } from 'next-intl';
import { usePydanticFormContext } from 'pydantic-forms';

export const RenderFormErrors = () => {
    const { errorDetails } = usePydanticFormContext();
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
        <em className="error backend-validation-metadata">
            {!!rootError && <div>{rootError.msg}</div>}
            {!!otherErrors.length &&
                t('inputFieldsHaveValidationErrors', {
                    nrOfValidationErrors: otherErrors.length,
                })}
        </em>
    );
};
