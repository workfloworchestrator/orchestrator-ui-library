import React, { useState } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { UserInputFormWizard, WfoLoading } from '@/components';
import { useAxiosApiClient } from '@/components/WfoForms/useAxiosApiClient';
import { useOrchestratorTheme } from '@/hooks';
import { InputForm } from '@/types/forms';

interface WfoStepFormProps {
    userInputForm: InputForm;
    isTask: boolean;
    processId?: string;
}

export const WfoStepForm = ({
    userInputForm,
    isTask,
    processId,
}: WfoStepFormProps) => {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { theme } = useOrchestratorTheme();
    const apiClient = useAxiosApiClient();

    const submitForm = (processInput: object[]) => {
        if (!processId) {
            return Promise.reject();
        }

        return apiClient.resumeProcess(processId, processInput).then(() => {
            setIsProcessing(true);
            console.log('RESUMED: ' + processId);
        });
    };

    return (
        <EuiFlexItem css={{ margin: theme.size.m }}>
            {(isProcessing && <WfoLoading />) || (
                <UserInputFormWizard
                    stepUserInput={userInputForm}
                    validSubmit={submitForm}
                    cancel={() => {
                        console.log('Cancel, now what?');
                    }}
                    hasNext={false}
                    isTask={isTask}
                />
            )}
        </EuiFlexItem>
    );
};
