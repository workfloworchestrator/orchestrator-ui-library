import React from 'react';
import { useRouter } from 'next/router';

const StartWorkflowPage = () => {
    const router = useRouter();
    const { workflowName: workflowNameQueryParameter } = router.query;

    const processName = Array.isArray(workflowNameQueryParameter)
        ? workflowNameQueryParameter[0]
        : workflowNameQueryParameter;

    return <h1>New subscription: {processName}</h1>;
};

export default StartWorkflowPage;
