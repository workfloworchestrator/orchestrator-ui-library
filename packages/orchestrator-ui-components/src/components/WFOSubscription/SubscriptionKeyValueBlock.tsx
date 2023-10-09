import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import {
    WFOKeyValueTable,
    WFOKeyValueTableDataType,
} from '../WFOKeyValueTable/WFOKeyValueTable';

interface SubscriptionKeyValueBlockProps {
    title: string;
    keyValues: WFOKeyValueTableDataType[];
}

export const SubscriptionKeyValueBlock = ({
    title,
    keyValues,
}: SubscriptionKeyValueBlockProps) => {
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
                        keyValues={keyValues}
                        showCopyToClipboardIcon={false}
                    />
                </div>
            </div>
        </>
    );
};
