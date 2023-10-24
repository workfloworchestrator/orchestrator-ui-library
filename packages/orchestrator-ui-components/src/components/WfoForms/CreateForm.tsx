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
import { useAxiosApiClient } from './useAxiosApiClient';
interface IProps {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    preselectedInput?: unknown;
    formKey: string;
    handleSubmit: (userInputs: any) => void;
}

export default function CreateForm(props: IProps) {
    const { preselectedInput, formKey, handleSubmit } = props;
    const [form, setForm] = useState<Form>({});
    const { stepUserInput, hasNext } = form;
    const apiClient = useAxiosApiClient();

    const submit = useCallback(
        (userInputs: object[]) => {
            return apiClient.cimStartForm(formKey, userInputs).then((form) => {
                console.log('Submit {formkey} =', formKey);
                handleSubmit(form);
            });
        },
        [formKey, handleSubmit, apiClient],
    );

    useEffect(() => {
        if (formKey && apiClient) {
            apiClient.catchErrorStatus<FormNotCompleteResponse>(
                submit([]),
                510,
                (json) => {
                    setForm({
                        stepUserInput: json.form,
                        hasNext: json.hasNext ?? false,
                    });
                },
            );
        }
    }, [formKey, submit, preselectedInput, apiClient]);

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
