import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';
import React from 'react';
import CreateForm from '@orchestrator-ui/orchestrator-ui-components/src/components/forms/CreateForm';

export function FormsPage() {
    const handleSubmit = (userInputs: any) => {
        console.log('Submitted: ', userInputs);
    };

    return (
        <>
            <EuiPageHeader pageTitle="Form test" />
            <EuiHorizontalRule />
            <EuiSpacer />
            <CreateForm
                formKey={'minimal_example_form'}
                handleSubmit={handleSubmit}
            />
            <EuiSpacer />
        </>
    );
}

export default FormsPage;
