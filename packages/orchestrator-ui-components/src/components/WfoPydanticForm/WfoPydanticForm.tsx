import React, { useCallback, useMemo } from 'react';

import _ from 'lodash';
import { useRouter } from 'next/router';
import type { PydanticFormApiProvider } from 'pydantic-forms';
import { PydanticForm } from 'pydantic-forms';

import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import { Footer } from '@/components/WfoPydanticForm/Footer';
import { useGetPydanticFormsConfig } from '@/hooks/useGetPydanticFormsConfig';
import { StartWorkflowPayload } from '@/pages/processes/WfoStartProcessPage';
import { HttpStatus, isFetchBaseQueryError, isRecord } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';

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
  }, [startProcess, startProcessPayload]);

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
