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
import { Form } from '../../types/forms';
import UserInputFormWizard from './UserInputFormWizard';
import { apiClient } from '../../api';
import { useMutation, useQueryClient } from 'react-query';

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
        console.log('Received data', data);
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
                // Todo: determine if we need a global accessible form state
                queryClient.setQueryData(['formStatus'], data);
            },
            onSuccess: (data) => {
                console.log('onSuccess() data: ', data);
                if (data.type === 'FormValidationError') {
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
                console.log('onError()', error);
            },
            onSettled: () => {
                console.log('onSettled() flushing cache');
                // queryClient.invalidateQueries("formStatus").then()
            },
        },
    );

    // const submit = useCallback(
    //     (userInputs: {}[]) => {
    //         return mutate(userInputs)
    //     },
    //     [formKey, handleSubmit],
    // );

    const submit = useCallback(
        (userInputs: {}[]) => {
            return fetch(`${endpoint}/${formKey}`, {
                method: 'POST',
                body: JSON.stringify(userInputs),
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then((r) => r.json()); // It might be better to do the json() call in UserInputForm or in the wizard
            // }).then(r=>r.json()).then((form) => {handleSubmit(form)})

            // OLD code
            // return apiClient.cimStartForm(formKey, userInputs).then((form) => {
            //     console.log('Submit {formkey} =', formKey);
            //     handleSubmit(form);
            // });
        },
        [formKey, handleSubmit],
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
