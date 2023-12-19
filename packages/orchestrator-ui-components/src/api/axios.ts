/*
 * Copyright 2020-2021 SURF.
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
import axios, { AxiosRequestConfig } from 'axios';

// basic configuration for axios.
export const getAxiosInstance = (apiPath: string, accessToken?: string) => {
    const axiosRequestConfig: AxiosRequestConfig = {
        baseURL: apiPath,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
    };
    return axios.create(axiosRequestConfig);
};
