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

import { autoFieldFunction } from "custom/uniforms/AutoFieldLoader";
import { mount as enzyme } from "enzyme";
import createContext from "lib/uniforms-surfnet/__tests__/_createContext";
import en from "locale/en";
import { parse_translations_dict } from "locale/i18n";
import React, { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { context } from "uniforms";
import { AutoField } from "uniforms-unstyled";

test("Test suite must contain at least one test", () => {});

function TestWrapper({ uniformsOptions, children }: any) {
    const AutoFieldProvider = AutoField.componentDetectorContext.Provider;

    return (
        <context.Provider value={uniformsOptions.context}>
            <IntlProvider // Locale of the application
                locale="en-GB"
                // Locale of the fallback defaultMessage
                defaultLocale="en-GB"
                messages={parse_translations_dict(en)}
                onError={(_) => {}}
            >
                <AutoFieldProvider value={autoFieldFunction}>{children}</AutoFieldProvider>
            </IntlProvider>
        </context.Provider>
    );
}

function mount(node: ReactElement, options: any) {
    return enzyme(node, {
        wrappingComponent: TestWrapper,
        wrappingComponentProps: { uniformsOptions: options ?? createContext() },
    });
}

export default mount as typeof enzyme;
