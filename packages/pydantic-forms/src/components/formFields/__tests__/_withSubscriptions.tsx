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

import { ApiClient } from "api";
import { CustomApiClient } from "api/custom";
import { SubscriptionsContext } from "components/subscriptionContext";
import { ServicePortSubscription } from "utils/types";

test("Test suite must contain at least one test", () => {});

export default function withSubscriptions(component: JSX.Element) {
    const getSubscription = jest.fn<Partial<ServicePortSubscription>, [string]>();
    const getSubscriptions = jest.fn<
        Partial<ServicePortSubscription>[],
        [ApiClient, CustomApiClient, string[] | undefined, string[] | undefined]
    >();
    const clearSubscriptions = jest.fn();
    const subscriptions: { [index: string]: Partial<ServicePortSubscription> } = {};

    return {
        element: (
            <SubscriptionsContext.Provider
                value={
                    {
                        getSubscription,
                        getSubscriptions: (
                            apiClient: ApiClient,
                            customApiClient: CustomApiClient,
                            tags?: string[],
                            statuses?: string[]
                        ) => Promise.resolve(getSubscriptions(apiClient, customApiClient, tags, statuses)),
                        clearSubscriptions,
                        subscriptions,
                    } as any
                }
            >
                {component}
            </SubscriptionsContext.Provider>
        ),
        subscriptions,
        getSubscription,
        getSubscriptions,
        clearSubscriptions,
    };
}
