import React from 'react';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiSpacer,
} from '@elastic/eui';

export const WfoServiceTicketNewEmailPage = () => {
    return (
        <>
            <EuiSpacer />
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiPageHeader pageTitle={'New e-mail'} />
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
        </>
    );
};
