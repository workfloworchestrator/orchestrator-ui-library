import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';
import React, { FunctionComponent } from 'react';
import { FlushSettings } from './FlushSettings';
import { ModifySettings } from './ModifySettings';
import { Status } from './Status';

export const Settings: FunctionComponent = () => {
    return (
        <>
            <EuiPageHeader pageTitle="Settings" />
            <EuiHorizontalRule />
            <FlushSettings />
            <EuiSpacer />
            <ModifySettings />
            <EuiSpacer />
            <Status />
        </>
    );
};
