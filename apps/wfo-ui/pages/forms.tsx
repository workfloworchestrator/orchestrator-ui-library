import React from 'react';

import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { CreateForm } from '@orchestrator-ui/orchestrator-ui-components';

export function FormsPage() {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const handleSubmit = (userInputs: any) => {
        // eslint-disable-next-line no-console
        console.log('Submitted: ', userInputs);
    };

    return (
        <>
            <EuiPageHeader pageTitle="Form test" />
            <EuiHorizontalRule />
            <EuiSpacer />
            <CreateForm
                formKey={'all_form_fields'}
                handleSubmit={handleSubmit}
            />
            <EuiSpacer />
        </>
    );
}

export default FormsPage;
