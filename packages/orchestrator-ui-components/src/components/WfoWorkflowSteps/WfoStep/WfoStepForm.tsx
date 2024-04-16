import React, { useState } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { UserInputFormWizard, WfoLoading } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { useResumeProcessMutation } from '@/rtk/endpoints/forms';
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
    const [resumeProcess] = useResumeProcessMutation();

    const submitForm = (processInput: object[]) => {
        if (!processId) {
            return Promise.reject();
        }

        return resumeProcess({ processId, userInputs: processInput }).then(
            () => {
                setIsProcessing(true);
            },
        );
    };

    return (
        <EuiFlexItem css={{ margin: theme.size.m }}>
            {(isProcessing && <WfoLoading />) || (
                <UserInputFormWizard
                    stepUserInput={userInputForm}
                    stepSubmit={submitForm}
                    hasNext={false}
                    isTask={isTask}
                    isResuming={true}
                />
            )}
        </EuiFlexItem>
    );
};
