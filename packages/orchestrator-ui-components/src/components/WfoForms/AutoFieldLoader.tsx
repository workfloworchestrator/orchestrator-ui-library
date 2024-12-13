import { Context, GuaranteedProps } from 'uniforms';
import { AutoField } from 'uniforms-unstyled';

import {
    AcceptField,
    BoolField,
    ConnectedSelectField,
    ContactPersonNameField,
    CustomerField,
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
    RadioField,
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
                case 'imsPortId': // Deprecated
                    return ImsPortIdField;
                case 'imsNodeId': // Deprecated
                    return ImsNodeIdField;
                case 'timestamp':
                    return TimestampField; // Deprecated
            }
            break;
        case Object:
            switch (format) {
                case 'optGroup':
                    return OptGroupField;
                case 'summary':
                    return SummaryField;
            }
            break;
        case String:
            switch (format) {
                case 'subscriptionId':
                    return SubscriptionField;
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
                case 'customerId':
                    return CustomerField;
                case 'locationCode':
                    return LocationCodeField;
                case 'contactPersonName': // Deprecated
                    return ContactPersonNameField;
                case 'vlan': // Deprecated
                    return VlanField;
                case 'accept':
                    return AcceptField;
                case 'ipvanynetwork': // Deprecated
                    return IpNetworkField;
            }
            break;
    }

    if (allowedValues && format !== 'accept') {
        return checkboxes && fieldType !== Array
            ? RadioField
            : ConnectedSelectField;
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
