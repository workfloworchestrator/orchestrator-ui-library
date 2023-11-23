import React, { FC, useState } from 'react';

import {
    EuiFieldSearch,
    EuiPanel,
    EuiSpacer,
    EuiText,
    EuiTextColor,
} from '@elastic/eui';

import { WfoFrequentlyUsed } from '@/components';

export const WfoNewProcessPanel: FC = () => {
    const [value, setValue] = useState('');
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };
    const frequentlyUsedValues = [
        'IP Prefix',
        'SN8 LightPath',
        'NL8 MSC',
        'NL8 Service Port 100G',
        'SN8 AGGSP',
    ];

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
            <WfoFrequentlyUsed values={frequentlyUsedValues} />
        </EuiPanel>
    );
};
