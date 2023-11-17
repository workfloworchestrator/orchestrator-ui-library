import React from 'react';

import { WfoProcessDetailPage } from '@orchestrator-ui/orchestrator-ui-components';
import { useRouter } from 'next/router';

const ProcessDetailPage = () => {
    const router = useRouter();
    const { processId } = router.query;

    return (
        <>
            {(processId && typeof processId === 'string' && (
                <WfoProcessDetailPage processId={processId} />
            )) || <div>Invalid processID</div>}
        </>
    );
};

export default ProcessDetailPage;
