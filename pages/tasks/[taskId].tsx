import React from 'react';

import { useRouter } from 'next/router';

import { WfoProcessDetailPage } from '@orchestrator-ui/orchestrator-ui-components';

const TaskDetailPage = () => {
    const router = useRouter();
    const { taskId } = router.query;

    return (
        <>
            {(taskId && typeof taskId === 'string' && (
                <WfoProcessDetailPage processId={taskId} />
            )) || <div>Invalid taskId</div>}
        </>
    );
};

export default TaskDetailPage;
