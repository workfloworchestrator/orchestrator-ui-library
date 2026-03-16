import React, { useCallback, useMemo } from 'react';

import _ from 'lodash';
import { useRouter } from 'next/router';
import { PydanticForm } from 'pydantic-forms';
import type { PydanticFormApiProvider } from 'pydantic-forms';

import { PATH_METADATA_SCHEDULED_TASKS } from '@/components';
import { Footer } from '@/components/WfoPydanticForm/Footer';
import { useShowToastMessage } from '@/hooks';
import { useGetPydanticFormsConfig } from '@/hooks/useGetPydanticFormsConfig';
import {
  HttpStatus,
  ScheduledTaskPostPayload,
  isFetchBaseQueryError,
  isRecord,
  useCreateScheduledTaskMutation,
} from '@/rtk';
import { useStartFormMutation } from '@/rtk/endpoints/forms';
import { ToastTypes } from '@/types';

export const WfoScheduleTaskFormPage = () => {
  const { showToastMessage } = useShowToastMessage();

  const startSchedulePayload = {};
  const generateFormId = useMemo(() => {
    return `${JSON.stringify(startSchedulePayload)}`;
  }, [startSchedulePayload]);

  const [startForm] = useStartFormMutation();
  const [createScheduledTask, mutationState] = useCreateScheduledTaskMutation();
  const router = useRouter();

  const onSuccess = useCallback(
    async (_fieldValues: object, req: object) => {
      const request = req as {
        status: HttpStatus;
        data: ScheduledTaskPostPayload;
      };
      if (request?.data?.workflow_id) {
        const resp = await createScheduledTask(request.data);
        if (!resp?.error) {
          router.replace(PATH_METADATA_SCHEDULED_TASKS);
        }
      }
    },
    [router],
  );

  const getPydanticFormProvider = useCallback(() => {
    const pydanticFormProvider: PydanticFormApiProvider = async ({ requestBody = [], formKey }) => {
      const userInputs =
        _.isEmpty(startSchedulePayload) ? [...requestBody] : [{ ...startSchedulePayload }, ...requestBody];

      const response = startForm({
        formKey,
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
  }, [startForm, startSchedulePayload]);

  const config = useGetPydanticFormsConfig(getPydanticFormProvider, (props) => <Footer {...props} />);

  const handleCancel = useCallback(() => {
    const pfBasePath = PATH_METADATA_SCHEDULED_TASKS;
    router.replace(pfBasePath);
  }, [router]);

  if (mutationState.isError) {
    showToastMessage(ToastTypes.ERROR, '', 'Error while saving scheduled task');
    console.error('Error saving scheduled task', mutationState);
    return undefined;
  }

  return (
    <>
      <PydanticForm
        formKey="configure_schedule"
        formId={generateFormId}
        onSuccess={onSuccess}
        onCancel={handleCancel}
        config={config}
      />
    </>
  );
};
