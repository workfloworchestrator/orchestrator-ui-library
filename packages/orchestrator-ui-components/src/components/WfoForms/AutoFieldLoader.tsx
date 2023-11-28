import { Context, GuaranteedProps } from 'uniforms';
import { AutoField } from 'uniforms-unstyled';

import {
    AcceptField,
    BoolField,
    ContactPersonNameField,
    DateField,
    DividerField,
    ImsNodeIdField,
    ImsPortIdField,
    IpNetworkField,
    LabelField,
    ListField,
    LocationCodeField,
    LongTextField,
    NestField,
    NumField,
    OptGroupField,
    OrganisationField,
    ProductField,
    RadioField,
    SelectField,
    SubscriptionField,
    SubscriptionSummaryField,
    SummaryField,
    TextField,
    TimestampField,
    VlanField,
} from './formFields';

export function autoFieldFunction(
    props: GuaranteedProps<unknown> & Record<string, unknown>,
    uniforms: Context<Record<string, unknown>>,
) {
    const { allowedValues, checkboxes, fieldType, field } = props;
    const { format } = field;

    /*
      Note, uniforms adds the fieldType property with one of the primitive types (Number, String..) based on the value of "type" in
      node_modules/uniforms-bridge-json-schema/src/JSONSchemaBridge.ts. The only exception being dateFields where it matches on the
      "format" field being "date-time" to populate fieldType with a Date constructor
    */
    switch (fieldType) {
        case Number:
            switch (format) {
                case 'imsPortId': // Surf specific
                    return ImsPortIdField;
                case 'imsNodeId': // Surf specific
                    return ImsNodeIdField;
                case 'timestamp':
                    return TimestampField; // Surf specific
            }
            break;
        case Object:
            switch (format) {
                case 'optGroup':
                    return OptGroupField;
            }
            break;
        case String:
            switch (format) {
                case 'subscriptionId':
                    return SubscriptionField;
                case 'productId':
                    return ProductField;
                case 'long':
                    return LongTextField;
                case 'label':
                    return LabelField;
                case 'divider':
                    return DividerField;
                case 'summary':
                    return SummaryField;
                case 'subscription':
                    return SubscriptionSummaryField;
                case 'organisationId':
                    return OrganisationField;
                case 'locationCode':
                    return LocationCodeField;
                case 'contactPersonName': // Surf specific
                    return ContactPersonNameField;
                case 'vlan': // Surf specific
                    return VlanField;
                case 'accept':
                    return AcceptField;
                case 'ipvanynetwork': // Surf specific
                    return IpNetworkField;
            }
            break;
    }

    if (allowedValues && format !== 'accept') {
        return checkboxes && fieldType !== Array ? RadioField : SelectField;
    } else {
        switch (fieldType) {
            case Array:
                return ListField;
            case Boolean:
                return BoolField;
            case Number:
                return NumField;
            case Object:
                return NestField;
            case String:
                return TextField;
            case Date:
                // See the note at line above about how Date fields are matched on the "format" field instead of "type" like other fields
                return DateField;
        }
    }

    return AutoField.defaultComponentDetector(props, uniforms);
}
