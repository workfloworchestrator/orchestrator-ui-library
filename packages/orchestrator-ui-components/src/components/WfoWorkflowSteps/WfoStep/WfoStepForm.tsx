import React, { useCallback, useMemo } from 'react';

import { useTranslations } from 'next-intl';
import { PydanticForm, PydanticFormApiProvider } from 'pydantic-forms';

import { EuiFlexItem } from '@elastic/eui';

import { StepFormFooter } from '@/components/WfoWorkflowSteps/WfoStep/WfoStepFormFooter';
import { useGetPydanticFormsConfig, useOrchestratorTheme, useShowToastMessage } from '@/hooks';
import { HttpStatus } from '@/rtk';
import { useResumeProcessMutation } from '@/rtk/endpoints/forms';
import { FormUserPermissions, InputForm, ToastTypes } from '@/types';

interface WfoStepFormProps {
  userInputForm: InputForm;
  isTask: boolean;
  processId: string;
  userPermissions: FormUserPermissions;
}

export const WfoStepForm = ({ userInputForm, isTask, processId, userPermissions }: WfoStepFormProps) => {
  const { theme } = useOrchestratorTheme();
  const t = useTranslations('pydanticForms.userInputForm');
  const { showToastMessage } = useShowToastMessage();

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
            } else if (error.status === HttpStatus.FormNotComplete) {
              return error.data;
            } else if (error.status === HttpStatus.BadRequest) {
              return {
                ...error.data,
                status: error.status,
              };
            } else if (error.status === HttpStatus.Forbidden) {
              const detail = typeof error.data?.detail === 'string' ? error.data.detail : '';
              showToastMessage(ToastTypes.ERROR, detail || t('forbiddenFallback'), t('forbiddenTitle'));
              return {
                validation_errors: [{ loc: ['__root__'], msg: detail || t('forbiddenFallback'), type: 'forbidden' }],
              };
            }
            throw error;
          });
      },
    [getInitialStepInput, processId, resumeProcess, showToastMessage, t],
  );

  const Footer = () => <StepFormFooter isTask={isTask} isResumeAllowed={userPermissions.resumeAllowed} />;

  const config = useGetPydanticFormsConfig(getStepFormProvider, Footer);

  return (
    <EuiFlexItem css={{ margin: theme.size.m }}>
      <PydanticForm formKey={processId} formId="wfo-step-form" config={config} />
    </EuiFlexItem>
  );
};
