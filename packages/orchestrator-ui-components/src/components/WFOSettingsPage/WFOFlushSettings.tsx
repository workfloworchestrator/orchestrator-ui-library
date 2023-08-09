import {
    EuiButton,
    EuiSpacer,
    EuiPanel,
    EuiText,
    EuiComboBox,
} from '@elastic/eui';
import React, { FunctionComponent, useContext, useState } from 'react';
import { useCacheNames } from '../../hooks/DataFetchHooks';
import { OrchestratorConfigContext } from '../../contexts/OrchestratorConfigContext';
import { EuiComboBoxOptionOption } from '@elastic/eui/src/components/combo_box/types';
import { useToastMessage } from '../../hooks';
import { ToastTypes } from '../../contexts';

const clearCache = async (apiUrl: string, settingName: string) => {
    const response = await fetch(apiUrl + `/settings/cache/${settingName}`, {
        method: 'DELETE',
    });
    return await response.json();
};

export const WFOFlushSettings: FunctionComponent = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const [selectedOptions, setSelected] = useState<EuiComboBoxOptionOption[]>(
        [],
    );
    const toastsMessage = useToastMessage();

    const onChange = (selectedOptions: EuiComboBoxOptionOption[]) => {
        setSelected(selectedOptions);
    };
    const { data } = useCacheNames();

    let options: EuiComboBoxOptionOption[];
    if (data && Object.entries(data).length > 0) {
        options = Object.entries(data).map(([key, value]) => ({
            key: key,
            label: value,
        }));
    } else {
        options = [{ label: 'Loading...' }];
    }

    const flushCache = async () => {
        if (selectedOptions.length < 1) {
            return;
        }
        const cacheKey = selectedOptions.map((obj) => obj.key).join(', ');
        await clearCache(orchestratorApiBaseUrl, cacheKey).then(() => {
            toastsMessage?.addToast(
                ToastTypes.ERROR,
                <p>
                    Cache for cache key &quot;{cacheKey}&quot; flushed
                    successfully
                </p>,
            );
        });
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
        </EuiPanel>
    );
};
