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
import { AxiosInstance } from 'axios';

import { ProductDefinition } from '../types';
import { getAxiosInstance } from './axios';

const FORMS_ENDPOINT = 'surf/forms/';
const PROCESS_ENDPOINT = 'processes/';
const PRODUCTS_ENDPOINT = 'products/';

export class BaseApiClient {
    private _axiosInstance: AxiosInstance;

    constructor(apiPath: string) {
        this._axiosInstance = getAxiosInstance(apiPath);
    }

    axiosFetch = <R = object>(
        path: string,
        options = {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        headers = {},
        showErrorDialog = true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        result = true,
    ): Promise<R> => {
        // preset the config with the relative URL and a GET type.
        // presets can be overridden with `options`.
        return this._axiosInstance({ url: path, method: 'GET', ...options })
            .then((res) => res.data)
            .catch((err) => {
                if (showErrorDialog) {
                    console.debug(
                        `Show error dialog for GET ${path} returning ${err?.response?.status}`,
                    );
                    setTimeout(() => {
                        throw err;
                    }, 250);
                }
                throw err;
            });
    };

    catchErrorStatus = <T>(
        promise: Promise<unknown>,
        status: number,
        callback: (json: T) => void,
    ) => {
        return promise.catch((err) => {
            if (err.response && err.response.status === status) {
                callback(err.response.data);
            } else {
                throw err;
            }
        });
    };

    fetchJson = <R = object>(
        path: string,
        options = {},
        headers = {},
        showErrorDialog = true,
        result = true,
    ): Promise<R> => {
        return this.axiosFetch(path, options, headers, showErrorDialog, result);
    };

    fetchJsonWithCustomErrorHandling = <R = object>(
        path: string,
    ): Promise<R> => {
        return this.fetchJson(path, {}, {}, false, true);
    };

    postPutJson = <R = object>(
        path: string,
        processInput: object,
        method: string,
        showErrorDialog = true,
        result = true,
    ): Promise<R> => {
        return this.axiosFetch(
            path,
            { method: method, data: processInput },
            {},
            showErrorDialog,
            result,
        );
    };
}

abstract class ApiClientInterface extends BaseApiClient {
    abstract cimStartForm: (
        formKey: string,
        userInputs: object[],
    ) => Promise<object>;
}

export class ApiClient extends ApiClientInterface {
    startProcess = (
        workflowName: string,
        processInput: object,
    ): Promise<unknown> => {
        return this.postPutJson<unknown>(
            `${PROCESS_ENDPOINT}${workflowName}`,
            processInput,
            'post',
            false,
            true,
        );
    };
    products = (): Promise<ProductDefinition[]> => {
        return this.fetchJson<ProductDefinition[]>(PRODUCTS_ENDPOINT);
    };
    productById = (productId: string): Promise<ProductDefinition> => {
        return this.fetchJson(`${PRODUCTS_ENDPOINT}${productId}`);
    };
    cimStartForm = (
        formKey: string,
        userInputs: object[],
    ): Promise<{ id: string }> => {
        return this.postPutJson(
            `${FORMS_ENDPOINT}${formKey}`,
            userInputs,
            'post',
            false,
            true,
        );
    };
}

export function getApiClient(apiEndPoint: string) {
    return new ApiClient(apiEndPoint);
}
