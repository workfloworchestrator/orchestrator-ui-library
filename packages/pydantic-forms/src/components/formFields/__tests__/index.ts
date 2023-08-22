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
import * as surfnet from "lib/uniforms-surfnet/src";

it("exports everything", () => {
    expect(surfnet).toEqual({
        AcceptField: expect.any(Function),
        AutoFields: expect.any(Function),
        BoolField: expect.any(Function),
        DateField: expect.any(Function),
        DividerField: expect.any(Function),
        ErrorField: expect.any(Function),
        ErrorsField: expect.any(Function),
        HiddenField: expect.any(Function),
        LabelField: expect.any(Function),
        ListAddField: expect.any(Function),
        ListDelField: expect.any(Function),
        ListField: expect.any(Function),
        ListItemField: expect.any(Function),
        ListSelectField: expect.any(Function),
        LocationCodeField: expect.any(Function),
        LongTextField: expect.any(Function),
        NestField: expect.any(Function),
        NumField: expect.any(Function),
        OptGroupField: expect.any(Function),
        OrganisationField: expect.any(Function),
        ProductField: expect.any(Function),
        RadioField: expect.any(Function),
        SelectField: expect.any(Function),
        SubscriptionField: expect.any(Function),
        SubscriptionSummaryField: expect.any(Function),
        SummaryField: expect.any(Function),
        SubmitField: expect.any(Function),
        TextField: expect.any(Function),
        TimestampField: expect.any(Function),
    });
});
