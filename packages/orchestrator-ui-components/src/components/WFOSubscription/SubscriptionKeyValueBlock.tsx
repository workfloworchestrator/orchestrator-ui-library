import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import {
    WFOKeyValueTable,
    WFOKeyValueTableDataType,
} from '../WFOKeyValueTable/WFOKeyValueTable';
import { useOrchestratorTheme } from '../../hooks';

interface SubscriptionKeyValueBlockProps {
    title: string;
    keyValues: WFOKeyValueTableDataType[];
}

export const SubscriptionKeyValueBlock = ({
    title,
    keyValues,
}: SubscriptionKeyValueBlockProps) => {
    const { theme } = useOrchestratorTheme();
    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <div>
                <div style={{ marginTop: 5 }}>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem>
                            <EuiText
                                grow={false}
                                css={{ fontWeight: theme.font.weight.medium }}
                            >
                                {title}
                            </EuiText>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'m'}></EuiSpacer>
                    <WFOKeyValueTable
                        keyValues={keyValues}
                        showCopyToClipboardIcon={false}
                    />
                </div>
            </div>
        </>
    );
};
