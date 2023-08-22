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

import UserInputForm from "components/inputForms/UserInputForm";
import { intl } from "locale/i18n";
import hash from "object-hash";
import React, { useContext, useEffect, useState } from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import ApplicationContext from "utils/ApplicationContext";
import { setFlash } from "utils/Flash";
import { FormNotCompleteResponse, InputForm } from "utils/types";
import { stop } from "utils/Utils";

interface Form {
    form: InputForm;
    hasNext?: boolean;
}

interface IProps extends WrappedComponentProps {
    stepUserInput: InputForm;
    validSubmit: (form: {}[]) => Promise<void>;
    cancel: () => void;
    hasNext?: boolean;
}

function UserInputFormWizard({ hasNext = false, stepUserInput, validSubmit, cancel }: IProps) {
    const { apiClient } = useContext(ApplicationContext);
    const [forms, setForms] = useState<Form[]>([{ form: stepUserInput, hasNext: hasNext }]);
    const [userInputs, setUserInputs] = useState<{}[]>([]);

    useEffect(() => {
        setForms([{ form: stepUserInput, hasNext: hasNext }]);
    }, [hasNext, stepUserInput]);

    const previous = (e: React.MouseEvent<HTMLButtonElement>) => {
        stop(e);
        const current = forms.pop();
        setForms(forms.filter((item) => item !== current));
    };

    const submit = (currentFormData: {}) => {
        let newUserInputs = userInputs.slice(0, forms.length - 1);
        newUserInputs.push(currentFormData);

        let result = validSubmit(newUserInputs);
        return apiClient.catchErrorStatus<FormNotCompleteResponse>(result, 510, (json) => {
            // Scroll to top when navigating to next screen of wizard
            window.scrollTo(0, 0);
            setFlash(intl.formatMessage({ id: "process.flash.wizard_next_step" }));
            setForms([...forms, { form: json.form, hasNext: json.hasNext }]);
            setUserInputs(newUserInputs);
        });
    };

    const currentForm = forms[forms.length - 1];
    const currentUserInput = userInputs[forms.length - 1];
    if (!currentForm || !currentForm.form.properties) {
        return null;
    }

    /* Generate a key based on input widget names that results in a new
     * clean instance + rerender of UserInputForm if the form changes. Without this, state of previous,
     * wizard step can cause wrong/weird default values for forms inputs.
     *
     * Note: to ensure a new form for multiple form wizard steps with exactly the same fields and labels on
     * the form the hash is calculated on the form object itself + length, which generates a unique hash as it
     * has a changing ".length" attribute.
     * */
    const key = hash.sha1({ form: currentForm.form, length: forms.length });
    return (
        <div>
            <UserInputForm
                key={key}
                stepUserInput={currentForm.form}
                validSubmit={submit}
                previous={previous}
                hasNext={currentForm.hasNext}
                hasPrev={forms.length > 1}
                cancel={cancel}
                userInput={currentUserInput}
            />
        </div>
    );
}

export default injectIntl(UserInputFormWizard);
