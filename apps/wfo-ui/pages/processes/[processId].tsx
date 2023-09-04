import React from 'react';
import { useRouter } from 'next/router';
import { WFOProcessDetailPage } from '@orchestrator-ui/orchestrator-ui-components';

const ProcessDetailPage = () => {
    const router = useRouter();
    const { processId } = router.query;

    return (
        <>
            {(processId && typeof processId === 'string' && (
                <WFOProcessDetailPage processId={processId} />
            )) || <div>Invalid processID</div>}
        </>
    );
};

export default ProcessDetailPage;
