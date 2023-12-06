import React from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { UserInputFormWizard } from '@/components';
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
    const { theme } = useOrchestratorTheme();
    const apiClient = useAxiosApiClient();

    const submitForm = (processInput: object[]) => {
        if (!processId) {
            return Promise.reject();
        }

        return apiClient.resumeProcess(processId, processInput).then(() => {
            console.log('RESUMED: ' + processId);
        });
    };

    return (
        <EuiFlexItem css={{ margin: theme.size.m }}>
            <UserInputFormWizard
                stepUserInput={userInputForm}
                validSubmit={submitForm}
                cancel={() => {
                    console.log('Cancel, now what?');
                }}
                hasNext={false}
                isTask={isTask}
            />
        </EuiFlexItem>
    );
};
