import React, { useCallback, useMemo } from 'react';

import { PydanticForm, PydanticFormApiProvider } from 'pydantic-forms';

import { EuiFlexItem } from '@elastic/eui';

import { Header, Row, useWfoPydanticFormConfig } from '@/components';
import { StepFormFooter } from '@/components/WfoWorkflowSteps/WfoStep/WfoStepFormFooter';
import { useOrchestratorTheme } from '@/hooks';
import { HttpStatus } from '@/rtk';
import { useResumeProcessMutation } from '@/rtk/endpoints/forms';
import { FormUserPermissions, InputForm } from '@/types/forms';

interface WfoStepFormProps {
    userInputForm: InputForm;
    isTask: boolean;
    processId: string;
    userPermissions: FormUserPermissions;
}

export const WfoStepForm = ({
    userInputForm,
    isTask,
    processId,
    userPermissions,
}: WfoStepFormProps) => {
    const { theme } = useOrchestratorTheme();
    const {
        wfoComponentMatcherExtender,
        pydanticLabelProvider,
        customTranslations,
    } = useWfoPydanticFormConfig();
    const [resumeProcess] = useResumeProcessMutation();

    const getInitialStepInput = useMemo(() => userInputForm, [userInputForm]);

    const getStepFormProvider = useCallback(
        (): PydanticFormApiProvider =>
            async ({ requestBody = [] }) => {
                if (requestBody.length === 0) {
                    return {
                        form: getInitialStepInput,
                        meta: { hasNext: false },
                    };
                }

                return resumeProcess({ processId, userInputs: requestBody })
                    .unwrap()
                    .catch((error) => {
                        if (error.status === HttpStatus.BadGateway) {
                            return {};
                        } else if (
                            error.status === HttpStatus.FormNotComplete
                        ) {
                            return error.data;
                        } else if (error.status === HttpStatus.BadRequest) {
                            return {
                                ...error.data,
                                status: error.status,
                            };
                        }
                        throw error;
                    });
            },
        [getInitialStepInput, processId, resumeProcess],
    );

    return (
        <EuiFlexItem css={{ margin: theme.size.m }}>
            <PydanticForm
                formKey={processId}
                config={{
                    apiProvider: getStepFormProvider(),
                    footerRenderer: () => (
                        <StepFormFooter
                            isTask={isTask}
                            isResumeAllowed={userPermissions.resumeAllowed}
                        />
                    ),
                    headerRenderer: Header,
                    componentMatcherExtender: wfoComponentMatcherExtender,
                    rowRenderer: Row,
                    labelProvider: pydanticLabelProvider,
                    customTranslations: customTranslations,
                }}
            />
        </EuiFlexItem>
    );
};
