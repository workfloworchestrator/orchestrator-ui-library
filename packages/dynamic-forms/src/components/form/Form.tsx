/**
 * Dynamic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import React from 'react';

import { EuiCard, EuiHeader, EuiIcon } from '@elastic/eui';

import DynamicFormFooter from '@/components/form/Footer';
import { RenderFields } from '@/components/render/Fields';
import RenderFormErrors from '@/components/render/RenderFormErrors';
import { RenderSections } from '@/components/render/Sections';
import { IDynamicFormsContextProps } from '@/types';

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
            <EuiHeader>{title ? title : formData.title}</EuiHeader>

            {headerComponent}

            <RenderFormErrors />

            <div className="form-content-wrapper">
                {formData.sections.map((section) => (
                    <RenderSections section={section} key={section.id}>
                        {({ fields }) => (
                            <EuiCard title={section.title}>
                                <div
                                    style={{
                                        marginTop: '-0.75rem',
                                        marginBottom: '-0.75rem',
                                    }}
                                >
                                    <RenderFields fields={fields} />
                                </div>
                            </EuiCard>
                        )}
                    </RenderSections>
                ))}
            </div>

            <DynamicFormFooter />
        </form>
    );
};

export default RenderMainForm;
