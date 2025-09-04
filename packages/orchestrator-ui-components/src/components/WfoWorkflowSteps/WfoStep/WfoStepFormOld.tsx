import React, { useState } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { UserInputFormWizard, WfoError, WfoLoading } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { HttpStatus } from '@/rtk';
import { useResumeProcessMutation } from '@/rtk/endpoints/forms';
import { FormUserPermissions, InputForm } from '@/types/forms';

interface WfoStepFormProps {
    userInputForm: InputForm;
    isTask: boolean;
    processId?: string;
    userPermissions: FormUserPermissions;
}

export const WfoStepFormOld = ({
    userInputForm,
    isTask,
    processId,
    userPermissions,
}: WfoStepFormProps) => {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const { theme } = useOrchestratorTheme();
    const [resumeProcess] = useResumeProcessMutation();

    const submitForm = (processInput: object[]) => {
        if (!processId) {
            return Promise.reject();
        }

        return resumeProcess({ processId, userInputs: processInput })
            .unwrap()
            .then(() => {
                setIsProcessing(true);
            })
            .catch((error) => {
                if (error?.status !== HttpStatus.FormNotComplete) {
                    if (error?.status === HttpStatus.BadRequest) {
                        // Rethrow the error so userInputForm can catch it and display validation errors
                        throw error;
                    }
                    console.error(error);
                    setHasError(true);
                } else {
                    throw error;
                }
            });
    };

    return (
        <EuiFlexItem css={{ margin: theme.size.m }}>
            {(hasError && <WfoError />) || (isProcessing && <WfoLoading />) || (
                <UserInputFormWizard
                    stepUserInput={userInputForm}
                    stepSubmit={submitForm}
                    hasNext={false}
                    isTask={isTask}
                    isResuming={true}
                    allowSubmit={userPermissions.resumeAllowed}
                />
            )}
        </EuiFlexItem>
    );
};
