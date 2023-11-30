import React from 'react';

import { EuiHorizontalRule, EuiPageHeader } from '@elastic/eui';
import WfoDiffViewer from '@orchestrator-ui/orchestrator-ui-components/src/components/WfoDiffViewer/WfoDiffViewer';

export function DiffsPage() {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const handleSubmit = (userInputs: any) => {
        // eslint-disable-next-line no-console
        console.log('Submitted: ', userInputs);
    };

    return (
        <>
            <EuiPageHeader pageTitle="Diff test" />
            <EuiHorizontalRule />
            <WfoDiffViewer></WfoDiffViewer>
        </>
    );
}

export default DiffsPage;
