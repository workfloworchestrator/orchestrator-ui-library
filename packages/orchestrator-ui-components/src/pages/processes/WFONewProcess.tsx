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

import { EuiPage, EuiPageBody } from "@elastic/eui";
import { JSONSchema6 } from "json-schema";
import React, { useCallback, useEffect, useState } from "react";
import {Form, FormNotCompleteResponse} from "../../types/forms";
import {EngineStatus} from "../../hooks";
import {ProductDefinition} from "../../types";
import {apiClient} from "../../api";
import UserInputFormWizard from "../../components/WFOForms/UserInputFormWizard";

// import { newProcessStyling } from "./NewProcessStyling";

export function productById(id: string, products: ProductDefinition[]): ProductDefinition {
    return products.find((prod) => prod.product_id === id)!;
}


interface PreselectedInput {
    product?: string;
    organisation?: string;
    prefix?: string;
    prefixlen?: string;
    prefix_min?: string;
}

interface IProps {
    preselectedInput: PreselectedInput;
    products: ProductDefinition[]
}

export default function WFONewProcess(props: IProps) {
    const { preselectedInput , products} = props;
    const [form, setForm] = useState<Form>({});
    const { stepUserInput, hasNext } = form;

    const submit = useCallback(
        (processInput: {}[]) => {
            if (preselectedInput.product) {
                processInput = [{ product: preselectedInput.product }, ...processInput];
            }

            const productId = (processInput as { product: string }[])[0].product;
            const product = productById(productId, products);
            const workflow = product.workflows.find((wf) => wf.target === "CREATE")!.name;

            let promise = apiClient.startProcess(workflow, processInput).then(
                (process) => {
                    alert("Done")
                    // redirect(`/processes/${process.id}`);
                    // setFlash(
                    //     intl.formatMessage(
                    //         { id: "process.flash.create_create" },
                    //         { name: product.name, pid: process.id }
                    //     )
                    // );
                },
                (e) => {
                    throw e;
                }
            );

            return apiClient.catchErrorStatus<EngineStatus>(promise, 503, (json) => {
                // setFlash(
                //     intl.formatMessage({ id: `settings.status.engine.${json.global_status.toLowerCase()}` }),
                //     "error"
                // );
                // redirect("/processes");
                alert("Old CIM code?")
            });
        },
        [products, preselectedInput, apiClient]
    );

    useEffect(() => {
        if (preselectedInput.product) {
            apiClient.catchErrorStatus<FormNotCompleteResponse>(submit([]), 510, (json) => {
                setForm({
                    stepUserInput: json.form,
                    hasNext: json.hasNext ?? false,
                });
            });
        } else {
            setForm({
                stepUserInput: {
                    title: "Kies product",
                    type: "object",
                    properties: {
                        product: {
                            type: "string",
                            format: "productId",
                            productIds: products
                                // .filter((prod) => !isEmpty(prod.workflows.find((wf) => wf.target === TARGET_CREATE)))
                                .filter((prod) => prod.status === "active")
                                .map((product) => product.product_id),
                        },
                    },
                } as JSONSchema6,
                hasNext: true,
            });
        }
    }, [products, submit, preselectedInput, apiClient]);

    return (
        <EuiPage>
            <EuiPageBody component="div" className="mod-new-process">
                <section className="card">
                    <h1>
                        New process
                    </h1>
                    {stepUserInput && (
                        <UserInputFormWizard
                            stepUserInput={stepUserInput}
                            validSubmit={submit}
                            cancel={() => alert("Cancelled")}
                            hasNext={hasNext ?? false}
                        />
                    )}
                </section>
            </EuiPageBody>
        </EuiPage>
    );
}
