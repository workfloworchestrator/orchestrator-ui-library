import React from 'react';

import { TreeProvider } from '@orchestrator-ui/orchestrator-ui-components';
import { useRouter } from 'next/router';

import { WfoServiceTicket } from './WfoServiceTicket';

export const WfoServiceTicketDetailPage = () => {
    const router = useRouter();
    const { serviceTicketId } = router.query;

    return (
        (serviceTicketId && (
            <TreeProvider>
                <WfoServiceTicket serviceTicketId={serviceTicketId as string} />
            </TreeProvider>
        )) || <></>
    );
};
