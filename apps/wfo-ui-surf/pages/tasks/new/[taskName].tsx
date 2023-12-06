import React from 'react';

import { useRouter } from 'next/router';

import { WfoStartProcessPage } from '@orchestrator-ui/orchestrator-ui-components';

const StartTaskPage = () => {
    const router = useRouter();
    const { taskName } = router.query;

    if (taskName && typeof taskName === 'string') {
        return <WfoStartProcessPage isTask={true} processName={taskName} />;
    }

    return <div>Invalid arguments provided</div>;
};

export default StartTaskPage;
