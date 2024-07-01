/**
 * Dynamic Forms
 *
 * This component will render all the fields based on the
 * config in the dynamicFormContext
 */
import { Col } from '@some-ui-lib';

import { IDynamicFormField } from '@/types';

interface IRenderFieldsProps {
    fields: IDynamicFormField[];
}

export function RenderFields({ fields }: IRenderFieldsProps) {
    return fields.map((field) => {
        const FormElement = field.FormElement;

        if (field.matchedFieldResult?.preventColRender) {
            return (
                <div key={field.id} e2e-id={field.id}>
                    {!!FormElement && <FormElement field={field} />}
                </div>
            );
        }

        return (
            <Col key={field.id} md={6} sm={12} e2e-id={field.id}>
                {!!FormElement && <FormElement field={field} />}
            </Col>
        );
    });
}
