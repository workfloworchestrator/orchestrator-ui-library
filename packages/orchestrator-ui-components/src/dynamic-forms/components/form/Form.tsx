/**
 * Dynamic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import React from 'react';

import { EuiCard, EuiHeader, EuiIcon } from '@elastic/eui';

import DynamicFormFooter from '@/dynamic-forms/components/form/Footer';
import { RenderFields } from '@/dynamic-forms/components/render/Fields';
import RenderFormErrors from '@/dynamic-forms/components/render/RenderFormErrors';
import { RenderSections } from '@/dynamic-forms/components/render/Sections';
import { IDynamicFormsContextProps } from '@/dynamic-forms/types';

const RenderMainForm = ({
    submitForm,
    formData,
    isLoading,
    isFullFilled,
    successNotice,
    isSending,
    title,
    headerComponent,
}: IDynamicFormsContextProps) => {
    if (isLoading && !isSending) {
        return <div>Formulier aan het ophalen...</div>;
    }

    if (!formData) {
        return <div>Formulier aan het ophalen...</div>;
    }

    if (isSending) {
        return <div>Formulier aan het verzenden...</div>;
    }

    if (isFullFilled) {
        return (
            <div className="info-box d-flex align-items-center">
                <EuiIcon type="sun" />{' '}
                {successNotice
                    ? successNotice
                    : 'Uw inzending is succesvol ontvangen'}
            </div>
        );
    }

    return (
        <form action={''} onSubmit={submitForm}>
            {title && <EuiHeader>{title}</EuiHeader>}

            {headerComponent}

            <RenderFormErrors />

            <div className="form-content-wrapper">
                {formData.sections.map((section) => (
                    <RenderSections section={section} key={section.id}>
                        {({ fields }) => {
                            return (
                                <div
                                    style={{
                                        marginTop: '-0.75rem',
                                        marginBottom: '-0.75rem',
                                    }}
                                >
                                    <RenderFields fields={fields} />
                                </div>
                            );
                        }}
                    </RenderSections>
                ))}
            </div>

            <DynamicFormFooter />
        </form>
    );
};

export default RenderMainForm;
