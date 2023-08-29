import ContactPersonNameField from '../formFields/custom/ContactPersonNameField';
import ImsPortIdField from '../formFields/custom/ImsPortIdField';
import IPvAnyNetworkField from '../formFields/custom/IPvAnyNetworkField';
import ImsNodeIdField from '../formFields/custom/logic/ImsNodeIdField';
import VlanField from '../formFields/custom/VlanField';
import {
    AcceptField,
    BoolField,
    DateField,
    DividerField,
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
} from '../formFields';
import { Context, GuaranteedProps } from 'uniforms';
import { AutoField } from 'uniforms-unstyled';

export function autoFieldFunction(
    props: GuaranteedProps<unknown> & Record<string, any>,
    uniforms: Context<unknown>,
) {
    const { allowedValues, checkboxes, fieldType, field } = props;
    const { format } = field;

    switch (fieldType) {
        case Number:
            switch (format) {
                case 'imsPortId':
                    return ImsPortIdField;
                case 'imsNodeId':
                    return ImsNodeIdField;
                case 'timestamp':
                    return TimestampField;
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
                case 'locationCode':
                    return LocationCodeField;
                case 'organisationId':
                    return OrganisationField;
                case 'contactPersonName':
                    return ContactPersonNameField;
                case 'vlan':
                    return VlanField;
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
                case 'accept':
                    return AcceptField;
                case 'ipvanynetwork':
                    return IPvAnyNetworkField;
            }
            break;
    }

    if (allowedValues && format !== 'accept') {
        if (checkboxes && fieldType !== Array) {
            return RadioField;
        } else {
            return SelectField;
        }
    } else {
        switch (fieldType) {
            case Array:
                return ListField;
            case Boolean:
                return BoolField;
            case Date:
                return DateField;
            case Number:
                return NumField;
            case Object:
                return NestField;
            case String:
                return TextField;
        }
    }

    // Todo React upgrade: fix uniform types
    // @ts-ignore
    return AutoField.defaultComponentDetector(props, uniforms);
}
