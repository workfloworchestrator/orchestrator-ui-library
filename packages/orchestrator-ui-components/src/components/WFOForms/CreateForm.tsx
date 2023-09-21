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
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { Form } from '../../types/forms';
import UserInputFormWizard from './UserInputFormWizard';
import { useMutation, useQueryClient } from 'react-query';
import { OrchestratorConfigContext } from '../../contexts';

interface CreateFormProps {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    preselectedInput?: any;
    formKey: string;
    handleSubmit: (userInputs: any) => void;
}

type MutationFunction = () => void;

export default function CreateForm({
    preselectedInput,
    formKey,
    handleSubmit,
}: CreateFormProps) {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const [form, setForm] = useState<Form>({});
    const { stepUserInput, hasNext } = form;
    const apiEndPoint = `${orchestratorApiBaseUrl}/${formKey}`;

    const queryClient = useQueryClient();

    const setFormStatus = async (data: any) => {
        const payload = data ?? [];
        console.log('calling setForStatus with ', data);
        const response = await fetch(`${apiEndPoint}/${formKey}`, {
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
                console.log('on mutate with', data);
                // Todo: determine if we need a global accessible form state
                queryClient.setQueryData(['formStatus'], data);
            },
            onSuccess: (data, query) => {
                console.log('mutate success', data);
                if (data.type === 'FormValidationError') {
                    // Do we ever get the errors here? Or are they always in the wizard?
                    alert('Validation logic, not sure where to handle this');
                    // console.log(data)
                } else {
                    setForm({
                        stepUserInput: data.form,
                        hasNext: data.hasNext ?? false,
                    });
                    // Todo: determine if we need a global accessible form state
                    queryClient.setQueryData(['formStatus'], data);
                }
            },
            onError: () => {
                console.log('createForm useMutation onError()', error);
            },
            onSettled: () => {
                console.log('createForm onSettled() flushing cache');
                // queryClient.invalidateQueries("formStatus").then()
            },
        },
    );

    const submit = useCallback(
        (userInputs: {}[]) => {
            return fetch(apiEndPoint, {
                method: 'POST',
                body: JSON.stringify(userInputs),
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((r) => {
                    console.log(`${endpoint}/${formKey}`, r);
                    return r.json();
                })
                .catch(() => {
                    console.log(
                        'Catching fetch failure when calling' + apiEndPoint,
                    );
                }); // It might be better to do the json() call in UserInputForm or in the wizard
            // }).then(r=>r.json()).then((form) => {handleSubmit(form)})

            // OLD code
            // return apiClient.cimStartForm(formKey, userInputs).then((form) => {
            //     console.log('Submit {formkey} =', formKey);
            //     handleSubmit(form);
            // });
        },
        [formKey, apiEndPoint],
    );

    useEffect(() => {
        if (formKey) {
            mutate([]);
        }
    }, [formKey, submit, preselectedInput, mutate]);

    return (
        <div>
            {isLoading && <div>Loading...</div>}
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
