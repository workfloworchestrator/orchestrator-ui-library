import React from 'react';
import { EuiPageHeader, EuiHorizontalRule, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router';
import CreateForm from '@orchestrator-ui/orchestrator-ui-components/src/components/WFOForms/CreateForm';

const StartWorkflowPage = () => {
    const router = useRouter();
    const { workflowName: workflowNameQueryParameter } = router.query;

    const handleSubmit = (userInputs: unknown) => {
        console.log('Submitted: ', userInputs);
    };

    const processName = Array.isArray(workflowNameQueryParameter)
        ? workflowNameQueryParameter[0]
        : workflowNameQueryParameter;

    // Check if workflow param is passed.
    // No: No workflow selected message
    // Yes: Call the workflow/processName endpoint
    // Reply 510: Inspect response and display form
    // Validation errors? Display them
    // New form. Display it in processDetail
    // Submit:
    // Post to /workflow/processName endpoint
    // On 200 redirect to processDetail/{processId}

    return (
        <>
            <EuiPageHeader pageTitle={processName} />
            <EuiHorizontalRule />
            <EuiSpacer />
            <CreateForm
                formKey={`processes/${processName}`}
                handleSubmit={handleSubmit}
            />
            <EuiSpacer />
        </>
    );
};

export default StartWorkflowPage;
