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

import ListDelField from "lib/uniforms-surfnet/src/ListDelField";
import React, { ReactNode } from "react";
import { connectField } from "uniforms";
import { AutoField } from "uniforms-unstyled";

export type ListItemFieldProps = {
    children?: ReactNode;
    name: string;
    outerList?: boolean;
};

function ListItem({ children = <AutoField label={null} name="" />, outerList = false }: ListItemFieldProps) {
    return (
        <li>
            {children}
            <ListDelField name="" outerList={outerList} />
        </li>
    );
}

export default connectField(ListItem, { initialValue: false });
