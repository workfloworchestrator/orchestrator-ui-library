import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import { RenderField } from './WFOSubscriptionBlock';
import { useOrchestratorTheme } from '../../hooks';
import {
    WFOKeyValueTable,
    WFOKeyValueTableDataType,
} from '../WFOKeyValueTable/WFOKeyValueTable';

export const WFOFixedInputBlock = (title: string, data: object) => {
    const { theme } = useOrchestratorTheme();

    const keys = [];
    for (const key in data) {
        keys.push(key);
    }
    if (keys.length === 0) return;

    const fixedInoutsKeyValues: WFOKeyValueTableDataType[] = keys.map(
        (key) => ({
            key: key,
            value: RenderField(key, data, theme),
        }),
    );

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <div>
                <div style={{ marginTop: 5 }}>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <h3>{title}</h3>
                            </EuiText>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'s'}></EuiSpacer>
                    <WFOKeyValueTable
                        keyValues={fixedInoutsKeyValues}
                        showCopyToClipboardIcon={false}
                    />
                </div>
            </div>
        </>
    );
};
