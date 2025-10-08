import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '../../hooks';
import {
    WfoKeyValueTable,
    WfoKeyValueTableDataType,
} from '../WfoKeyValueTable/WfoKeyValueTable';

interface SubscriptionKeyValueBlockProps {
    title: string;
    keyValues: WfoKeyValueTableDataType[];
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
                                css={{ fontWeight: theme.font.weight.semiBold }}
                            >
                                {title}
                            </EuiText>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'m'}></EuiSpacer>
                    <WfoKeyValueTable
                        keyValues={keyValues}
                        showCopyToClipboardIcon={true}
                    />
                </div>
            </div>
        </>
    );
};
