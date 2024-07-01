/**
 * Dynamic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import LoadingNotice from '~components/generic/LoadingNotice/LoadingNotice';

import { Card } from '@rijkshuisstijl/Elements/Card';
import { IconKlaarzetten, PageTitle, Row } from '@some-ui-lib';

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
        return <LoadingNotice>Formulier aan het ophalen...</LoadingNotice>;
    }

    if (!formData) {
        return <LoadingNotice>Formulier aan het ophalen...</LoadingNotice>;
    }

    if (isSending) {
        return <LoadingNotice>Formulier aan het verzenden...</LoadingNotice>;
    }

    if (isFullFilled) {
        return (
            <div className="info-box d-flex align-items-center">
                <IconKlaarzetten className="mr-3" />{' '}
                {successNotice
                    ? successNotice
                    : 'Uw inzending is succesvol ontvangen'}
            </div>
        );
    }

    return (
        <form action={''} onSubmit={submitForm}>
            <PageTitle>{title ? title : formData.title}</PageTitle>

            {headerComponent}

            <RenderFormErrors />

            <div className="form-content-wrapper">
                {formData.sections.map((section) => (
                    <RenderSections section={section} key={section.id}>
                        {({ fields }) => (
                            <Card title={section.title} spacious>
                                <Row
                                    style={{
                                        marginTop: '-0.75rem',
                                        marginBottom: '-0.75rem',
                                    }}
                                >
                                    <RenderFields fields={fields} />
                                </Row>
                            </Card>
                        )}
                    </RenderSections>
                ))}
            </div>

            <DynamicFormFooter />
        </form>
    );
};

export default RenderMainForm;
