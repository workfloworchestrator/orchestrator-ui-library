import {
    EuiButton,
    EuiSpacer,
    EuiPanel,
    EuiText,
    EuiComboBox,
} from '@elastic/eui';
import React, { FunctionComponent, useState } from 'react';
import { EuiComboBoxOptionOption } from '@elastic/eui/src/components/combo_box/types';

const options: EuiComboBoxOptionOption[] = [
    {
        label: 'CRM organisations, contacts and locations + IMS location_codes',
    },
];

export const FlushSettings: FunctionComponent = () => {
    const [selectedOptions, setSelected] =
        useState<EuiComboBoxOptionOption[]>();
    const onChange = (selectedOptions: EuiComboBoxOptionOption[]) => {
        setSelected(selectedOptions);
    };

    return (
        <EuiPanel
            hasShadow={false}
            color="subdued"
            paddingSize="l"
            style={{ width: '50%' }}
        >
            <EuiText size="s" style={{ fontWeight: 600 }}>
                <p>Flush Settings</p>
            </EuiText>
            <EuiSpacer size="m" />
            <EuiComboBox
                aria-label="Flush settings"
                placeholder="Select settings"
                singleSelection={{ asPlainText: true }}
                options={options}
                selectedOptions={selectedOptions}
                onChange={onChange}
                fullWidth
            />
            <EuiSpacer size="m" />
            <EuiButton iconType="refresh">Flush</EuiButton>
        </EuiPanel>
    );
};
