/**
 * Dynamic Forms
 *
 * Renders errors that are generated client-side
 */
import { useCallback, useState } from 'react';

import { IconButton, IconInfo, IconWaarschuwing } from '@some-ui-lib';

import { useDynamicFormsContext } from '@/core';

export default function RenderFormErrors() {
    const { errorDetails, formData } = useDynamicFormsContext();

    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = useCallback(() => {
        setShowDetails((state) => !state);
    }, []);

    if (!errorDetails) {
        return <></>;
    }

    const errors = errorDetails.source;
    const rootError = errors
        .filter((err) => err.loc.includes('__root__'))
        .shift();
    const otherErrors = errors.filter((err) => !err.loc.includes('__root__'));

    const multiMistakes = otherErrors?.length > 1;

    const getFieldLabel = (fieldId: string) => {
        const field = formData?.fields
            .filter((field) => field.id === fieldId)
            .shift();

        if (!field) {
            return fieldId;
        }

        return field.title;
    };

    return (
        <div className="mb-4 mt-4 error-box d-flex justify-content-between align-items-center">
            <div className="mw-80">
                <h3>Het formulier is nog niet correct ingevuld</h3>

                {!!rootError && <p>{rootError.msg}</p>}

                {!!otherErrors.length && (
                    <>
                        <div className="d-flex align-items-center">
                            Er {multiMistakes ? 'zijn' : 'is'}{' '}
                            {otherErrors?.length} rubriek
                            {multiMistakes && 'en'} nog niet correct ingevuld.{' '}
                            <IconButton
                                onClick={toggleDetails}
                                className="ml-2"
                            >
                                <IconInfo size={18} />
                            </IconButton>
                        </div>
                        {showDetails && (
                            <ul className="error-list mb-2">
                                {otherErrors.map((error) => (
                                    <li key={JSON.stringify(error)}>
                                        <strong>
                                            {error.loc
                                                .map(getFieldLabel)
                                                .join(', ')}
                                        </strong>
                                        : {error.msg}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
            <IconWaarschuwing
                style={{ opacity: 0.4 }}
                className="mr-3"
                size={40}
            />
        </div>
    );
}
