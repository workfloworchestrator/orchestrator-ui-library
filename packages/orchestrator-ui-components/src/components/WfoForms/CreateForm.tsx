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

import { UserInputFormWizard } from '@/components';
import { handlePromiseErrorWithCallback } from '@/rtk';
import { useStartFormMutation } from '@/rtk/endpoints/forms';
import { Form, FormNotCompleteResponse } from '@/types/forms';

interface IProps {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    preselectedInput?: unknown;
    formKey: string;
    handleSubmit: (userInputs: any) => void;
    handleCancel?: () => void;
}

export function CreateForm(props: IProps) {
    const { preselectedInput, formKey, handleSubmit, handleCancel } = props;
    const [form, setForm] = useState<Form>({});
    const { stepUserInput, hasNext } = form;
    const [startForm] = useStartFormMutation();

    const submit = useCallback(
        (userInputs: object[]) => {
            return startForm({ formKey, userInputs })
                .unwrap()
                .then((form) => {
                    handleSubmit(form);
                });
        },
        [formKey, handleSubmit, startForm],
    );

    useEffect(() => {
        if (formKey) {
            handlePromiseErrorWithCallback<FormNotCompleteResponse>(
                submit([]),
                510,
                (json) => {
                    setForm({
                        stepUserInput: json.form,
                        hasNext: json.meta?.hasNext ?? false,
                    });
                },
            );
        }
    }, [formKey, submit, preselectedInput]);

    return (
        <div>
            {stepUserInput && (
                <UserInputFormWizard
                    stepUserInput={stepUserInput}
                    stepSubmit={submit}
                    cancel={handleCancel}
                    hasNext={hasNext ?? false}
                    isTask={false}
                />
            )}
        </div>
    );
}
