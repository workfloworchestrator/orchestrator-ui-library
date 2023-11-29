import React from 'react';

import { useRouter } from 'next/router';

import { WfoProcessDetailPage } from '@orchestrator-ui/orchestrator-ui-components';

const ProcessDetailPage = () => {
    const router = useRouter();
    const { processId } = router.query;

    return (
        <>
            {(processId && typeof processId === 'string' && (
                <WfoProcessDetailPage processId={processId} />
            )) || <div>Invalid processId</div>}
        </>
    );
};

export default ProcessDetailPage;
