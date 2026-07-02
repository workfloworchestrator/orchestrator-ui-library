import React, { useCallback, useMemo } from 'react';

import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import type { PydanticFormApiProvider } from 'pydantic-forms';
import { PydanticForm } from 'pydantic-forms';

import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import { Footer } from '@/components/WfoPydanticForm/Footer';
import { useShowToastMessage } from '@/hooks';
import { useGetPydanticFormsConfig } from '@/hooks/useGetPydanticFormsConfig';
import { StartWorkflowPayload } from '@/pages/processes/WfoStartProcessPage';
import { HttpStatus, isFetchBaseQueryError, isRecord } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { ToastTypes } from '@/types';

interface WfoPydanticFormProps {
  processName: string;
  startProcessPayload?: StartWorkflowPayload;
  isTask?: boolean;
}

interface StartProcessResponse {
  id: string;
}

export const WfoPydanticForm = ({ processName, startProcessPayload, isTask }: WfoPydanticFormProps) => {
  const generateFormId = useMemo(() => {
    return `${JSON.stringify(startProcessPayload)}`;
  }, [startProcessPayload]);

  const [startProcess] = useStartProcessMutation();
  const router = useRouter();
  const t = useTranslations('pydanticForms.userInputForm');
  const { showToastMessage } = useShowToastMessage();

  const onSuccess = useCallback(
    (_fieldValues: object, req: object) => {
      const request = req as {
        status: HttpStatus;
        data: StartProcessResponse;
      };
      if (request?.data?.id) {
        const pfBasePath = isTask ? PATH_TASKS : PATH_WORKFLOWS;
        router.replace(`${pfBasePath}/${request.data.id}`);
      }
    },
    [isTask, router],
  );

  const getPydanticFormProvider = useCallback(() => {
    const pydanticFormProvider: PydanticFormApiProvider = async ({ requestBody = [], formKey }) => {
      const userInputs =
        _.isEmpty(startProcessPayload) ? [...requestBody] : [{ ...startProcessPayload }, ...requestBody];

      const response = startProcess({
        workflowName: formKey,
        userInputs,
      });
      return response
        .then(({ error, data }) => {
          return new Promise<Record<string, unknown>>((resolve) => {
            if (isFetchBaseQueryError(error) && isRecord(error.data)) {
              if (error.status === HttpStatus.FormNotComplete) {
                resolve(error.data);
              } else if (error.status === HttpStatus.BadRequest) {
                resolve({
                  ...error.data,
                  status: error.status,
                });
              } else if (error.status === HttpStatus.PreconditionFailed) {
                const detail = typeof error.data.detail === 'string' ? error.data.detail : '';
                showToastMessage(
                  ToastTypes.ERROR,
                  detail || t('preconditionFailedFallback'),
                  t('preconditionFailedTitle'),
                );
                router.replace(isTask ? PATH_TASKS : PATH_WORKFLOWS);
                resolve({
                  validation_errors: [
                    {
                      loc: ['__root__'],
                      msg: detail || t('preconditionFailedFallback'),
                      type: 'precondition_failed',
                    },
                  ],
                });
              }
            } else if (data) {
              resolve({
                data,
                status: HttpStatus.Created,
              });
            }

            resolve({});
          });
        })
        .catch((error) => {
          return new Promise<Record<string, object>>((resolve, reject) => {
            if (error.status === HttpStatus.FormNotComplete) {
              resolve(error.data);
            }
            reject(error);
          });
        });
    };

    return pydanticFormProvider;
  }, [startProcess, startProcessPayload, t, showToastMessage, router, isTask]);

  const config = useGetPydanticFormsConfig(getPydanticFormProvider, (props) => <Footer {...props} isTask={isTask} />);

  const handleCancel = useCallback(() => {
    const pfBasePath = isTask ? PATH_TASKS : PATH_WORKFLOWS;
    router.replace(pfBasePath);
  }, [isTask, router]);

  return (
    <PydanticForm
      formKey={processName}
      formId={generateFormId}
      onSuccess={onSuccess}
      onCancel={handleCancel}
      config={config}
    />
  );
};
