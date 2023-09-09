/*
 * Copyright 2019-2023 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Form, FormNotCompleteResponse } from '../../types/forms';
import UserInputFormWizard from './UserInputFormWizard';
import { apiClient } from '../../api';
import { EngineStatus, SubscriptionProcess } from '../../hooks';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useFormMutation } from '../../hooks/useForms';

interface IProps {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    preselectedInput?: any;
    formKey: string;
    handleSubmit: (userInputs: any) => void;
}

const endpoint = 'http://localhost:8080/api/surf/forms';

export default function CreateForm(props: IProps) {
    const { preselectedInput, formKey, handleSubmit } = props;
    const [form, setForm] = useState<Form>({});
    const { stepUserInput, hasNext } = form;

    const queryClient = useQueryClient();
    const setFormStatus = async (data: any) => {
        const payload = data ?? [];
        console.log('Using payload', payload);

        const response = await fetch(`${endpoint}/${formKey}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    };

    const { mutate, isLoading, error } = useMutation(
        'formStatus',
        setFormStatus,
        {
            onMutate: (data: any) => {
                console.log('onMutate() data: ', data);
                queryClient.setQueryData(['formStatus'], data); // Set loading state of the button
            },
            onSuccess: (data) => {
                console.log('onSuccess() data: ', data);
                setForm({
                    stepUserInput: data.form,
                    hasNext: data.hasNext ?? false,
                });
                queryClient.setQueryData(['formStatus'], data); // Set global status
            },
            onError: () => {
                console.log('onError()');
                alert('there was an error');
            },
            onSettled: () => {
                // console.log("onSettled() flushing cache")
                // queryClient.invalidateQueries('formStatus');
            },
        },
    );

    const submit = useCallback(
        (userInputs: {}[]) => {
            return apiClient.cimStartForm(formKey, userInputs).then((form) => {
                console.log('Submit {formkey} =', formKey);
                handleSubmit(form);
            });
        },
        [formKey, handleSubmit],
    );

    useEffect(() => {
        if (formKey) {
            mutate([]);
            // apiClient.catchErrorStatus<FormNotCompleteResponse>(
            //     submit([]),
            //     510,
            //     (json) => {
            //         setForm({
            //             stepUserInput: json.form,
            //             hasNext: json.hasNext ?? false,
            //         });
            //     },
            // );
        }
    }, [formKey, submit, preselectedInput]);

    return (
        <div>
            {stepUserInput && (
                <UserInputFormWizard
                    stepUserInput={stepUserInput}
                    validSubmit={submit}
                    cancel={() => alert('cancelled')}
                    hasNext={hasNext ?? false}
                />
            )}
        </div>
    );
}
