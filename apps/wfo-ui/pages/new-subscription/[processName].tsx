import React from 'react';
import { useRouter } from 'next/router';

const NewSubscriptionPage = () => {
    const router = useRouter();
    const { processName: processNameQueryParameter } = router.query;

    const processName = Array.isArray(processNameQueryParameter)
        ? processNameQueryParameter[0]
        : processNameQueryParameter;

    return <h1>New subscription: {processName}</h1>;
};

export default NewSubscriptionPage;
