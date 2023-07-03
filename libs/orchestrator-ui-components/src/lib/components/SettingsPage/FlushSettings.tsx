import {
    EuiButton,
    EuiSpacer,
    EuiPanel,
    EuiText,
    EuiComboBox,
    EuiGlobalToastList,
} from '@elastic/eui';
import React, { FunctionComponent, useContext, useState } from 'react';
import { useCacheNames } from '../../hooks/DataFetchHooks';
import { OrchestratorConfigContext } from '../../contexts/OrchestratorConfigContext';
import { EuiComboBoxOptionOption } from '@elastic/eui/src/components/combo_box/types';
import crypto from 'crypto';

const clearCache = async (apiUrl: string, settingName: string) => {
    const response = await fetch(apiUrl + `/settings/cache/${settingName}`, {
        method: 'DELETE',
    });
    return await response.json();
};

export const FlushSettings: FunctionComponent = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const [selectedOptions, setSelected] = useState<EuiComboBoxOptionOption[]>(
        [],
    );
    const [toasts, setToasts] = useState([]);

    const onChange = (selectedOptions: EuiComboBoxOptionOption[]) => {
        setSelected(selectedOptions);
    };
    const { data } = useCacheNames();

    let options: EuiComboBoxOptionOption[];
    if (data && typeof data === 'object' && Object.entries(data).length > 0) {
        options = Object.entries(data).map(([key, value]) => ({
            name: key,
            label: value,
        }));
    } else {
        options = [{ label: 'Loading...' }];
    }

    const flushCache = () => {
        if (selectedOptions.length < 1) {
            return;
        }
        clearCache(
            orchestratorApiBaseUrl,
            selectedOptions.map((obj) => obj.name).join(', '),
        ).then((count) => {
            addToast();
        });
    };

    const addToast = () => {
        setToasts((toasts) => [
            ...toasts,
            {
                id: crypto.randomBytes(8).toString('hex'),
                title: 'Cache cleared',
                color: 'success',
                iconType: 'check',
                text: <p>Added Successfully</p>,
                toastLifeTimeMs: 8000,
            },
        ]);
    };

    return (
        <EuiPanel
            hasShadow={false}
            color="subdued"
            paddingSize="l"
            style={{ width: '50%' }}
        >
            <EuiText size="s">
                <h4>Flush Settings</h4>
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
            <EuiButton onClick={flushCache} iconType="refresh">
                Flush
            </EuiButton>
            <EuiGlobalToastList
                toasts={toasts}
                dismissToast={() => setToasts([])}
            />
        </EuiPanel>
    );
};
