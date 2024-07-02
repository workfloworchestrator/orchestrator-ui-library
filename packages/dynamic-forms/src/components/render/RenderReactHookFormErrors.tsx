/**
 * Dynamic Forms
 *
 * Renders errors received from the backend after submitting the form
 */
import React from 'react';
import { useCallback, useState } from 'react';

import { EuiButtonIcon, EuiFlexItem } from '@elastic/eui';

import { useDynamicFormsContext } from '@/core';
import { getFieldLabelById } from '@/core/helper';

export default function RenderReactHookFormErrors() {
    const { rhf, formData } = useDynamicFormsContext();
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = useCallback(() => {
        setShowDetails((state) => !state);
    }, []);

    if (rhf.formState.isValid) {
        return <></>;
    }

    const numErrors = Object.keys(rhf.formState.errors).length;
    const multiMistakes = numErrors > 1;

    return (
        <EuiFlexItem
            title="Het formulier bevat tenminste één niet correct ingevulde rubriek,
		waardoor het niet opgeslagen kan worden."
        >
            {!!Object.keys(rhf.formState.errors).length && (
                <>
                    <div className="d-flex align-items-center">
                        Er {multiMistakes ? 'zijn' : 'is'} {numErrors} rubriek
                        {multiMistakes && 'en'} nog niet correct ingevuld.
                        <EuiButtonIcon
                            onClick={toggleDetails}
                            iconType="info"
                            className="ml-2"
                        />
                    </div>
                    {showDetails && (
                        <ul className="error-list mb-2">
                            {Object.keys(rhf.formState.errors).map(
                                (fieldKey) => {
                                    const field =
                                        rhf.formState?.errors[fieldKey];

                                    const fieldName = formData
                                        ? getFieldLabelById(fieldKey, formData)
                                        : fieldKey;
                                    return (
                                        <li key={fieldKey}>
                                            <strong className="mr-2">
                                                {fieldName}:{' '}
                                            </strong>
                                            {(field?.message as string) ?? ''}
                                        </li>
                                    );
                                },
                            )}
                        </ul>
                    )}
                </>
            )}
        </EuiFlexItem>
    );
}
