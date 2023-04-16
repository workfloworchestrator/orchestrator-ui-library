import React, { ReactElement, useState } from 'react';
import {
    EuiButton,
    EuiFieldSearch,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
    EuiTextColor,
} from '@elastic/eui';

export default function NewProcessPanel(): ReactElement {
    const [value, setValue] = useState('');
    const onChange = (e) => {
        setValue(e.target.value);
    };
    const frequentlyUsedValues = [
        'IP Prefix',
        'SN8 LightPath',
        'NL8 MSC',
        'NL8 Service Port 100G',
        'SN8 AGGSP',
    ];
    const renderFrequentlyUsed = (values) => {
        return (
            <EuiFlexGroup gutterSize="m">
                {values.map((value, index) => (
                    <EuiFlexItem key={index} grow={false}>
                        {/*@ts-ignore*/}
                        <EuiButton size="xs" style={{ minWidth: 0 }}>
                            {value}
                        </EuiButton>
                    </EuiFlexItem>
                ))}
            </EuiFlexGroup>
        );
    };

    return (
        <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
            <EuiText>
                <b>Start a new process</b>
            </EuiText>
            <EuiSpacer size="m" />
            <EuiFieldSearch
                fullWidth={true}
                placeholder="Search and select process"
                value={value}
                onChange={(e) => onChange(e)}
                aria-label="Search and select process"
            />
            <EuiSpacer size="m" />
            <EuiTextColor color="subdued">Frequently used:</EuiTextColor>
            <EuiSpacer size="s" />
            {renderFrequentlyUsed(frequentlyUsedValues)}
        </EuiPanel>
    );
}
