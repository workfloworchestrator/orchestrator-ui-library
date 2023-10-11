import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';
import React from 'react';
import CreateForm from '@orchestrator-ui/orchestrator-ui-components/src/components/WFOForms/CreateForm';

export function FormsPage() {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const handleSubmit = (userInputs: any) => {
        console.log('Submitted: ', userInputs);
    };

    return (
        <>
            <EuiPageHeader pageTitle="All Orchestrator Form Fields" />
            <EuiHorizontalRule />
            <CreateForm formKey={'pydantic_form'} handleSubmit={handleSubmit} />
            <EuiSpacer />
            <EuiSpacer />
            <CreateForm
                formKey={'surf_specific_form'}
                handleSubmit={handleSubmit}
            />
            <EuiSpacer />
        </>
    );
}

export default FormsPage;
