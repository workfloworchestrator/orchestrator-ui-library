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

import React, { useCallback, useEffect, useState } from "react";
import {Form, FormNotCompleteResponse} from "../../types/forms";
import UserInputFormWizard from "./UserInputFormWizard";

interface IProps {
    preselectedInput?: any;
    formKey: string;
    handleSubmit: (userInputs: any) => void;
}

const postPutJson = (path: string, body: {}, method: string): Promise<R> => {
    return fetch(path, { method: method, body: JSON.stringify(body), headers: { "Content-Type": "application/json" }}).then(response => alert(response.json()));
}

const catchErrorStatus = (promise: Promise<any>, status: number, callback: (json: T) => void) => {
    // if(status===503) alert("503");
    if (status === 510) {
        // debugger
        // return promise.catch((err) => {
        //     alert();
        //     if (err.response && err.response.status === status) {
        //         callback(err.response.data);
        //     } else {
        //         throw err;
        //     }
        // });
    }
    ;
}

function cimStartForm(formKey: string, userInputs: {}[]): Promise<{ id: string }> {
    console.log("userInputs:", userInputs)
    const putJson = postPutJson("http://localhost:8080/api/surf/forms/" + formKey, userInputs, "post");
    console.log("putJson:", putJson)
    return putJson
};


export default function CreateForm(props: IProps) {
    const { preselectedInput, formKey, handleSubmit } = props;
    const [form, setForm] = useState<Form>({});
    const { stepUserInput, hasNext } = form;

    const submit = useCallback(
        (userInputs: {}[]) => {
            // if (preselectedInput.product) {
            // Todo: decide if we want to implement pre-selections and design a way to do it generic
            //     userInputs = [{ preselectedInput }, ...userInputs];
            // }
            let promise = cimStartForm(formKey, userInputs).then(
                (form) => {
                    console.log("Submit {formkey} =", formKey)
                    handleSubmit(form);
                },
                (e) => {
                    throw e;
                }
            );

            // return catchErrorStatus<any>(promise, 503, (json) => {
            //     alert("/tickets");
            // });
        },
        [formKey, handleSubmit]
    );

    useEffect(() => {
        if (formKey) {
            catchErrorStatus<FormNotCompleteResponse>(submit([]), 510, (json) => {
                setForm({
                    stepUserInput: json.form,
                    hasNext: json.hasNext ?? false,
                });
            });
        }
    }, [formKey, submit, preselectedInput]);

    return (
        <div>
            {stepUserInput && (
                <UserInputFormWizard
                    stepUserInput={stepUserInput}
                    validSubmit={submit}
                    cancel={() => alert("cancelled")}
                    hasNext={hasNext ?? false}
                />
            )}
        </div>
    );
}
