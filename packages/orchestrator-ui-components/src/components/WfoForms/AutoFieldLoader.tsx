import {
    BoolField,
    DividerField,
    LabelField,
    ListField,
    LongTextField,
    NumField,
    RadioField,
    SelectField,
    TextField,
    ProductField,
    SubscriptionSummaryField,
} from './formFields';
import { Context, GuaranteedProps } from 'uniforms';
import { AutoField } from 'uniforms-unstyled';
import { NestField } from './formFields/NestField';

export function autoFieldFunction(
    props: GuaranteedProps<unknown> & Record<string, unknown>,
    uniforms: Context<Record<string, unknown>>,
) {
    const { allowedValues, checkboxes, fieldType, field } = props;
    const { format } = field;

    switch (fieldType) {
        case Number:
            switch (format) {
                case 'imsPortId':
                    return NumField;
                case 'imsNodeId':
                    return NumField;
                case 'timestamp':
                    return NumField;
            }
            break;
        case String:
            switch (format) {
                case 'productId':
                    return ProductField;
                case 'long':
                    return LongTextField;
                case 'label':
                    return LabelField;
                case 'divider':
                    return DividerField;
                case 'subscription':
                    return SubscriptionSummaryField;
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
        }
    }

    return AutoField.defaultComponentDetector(props, uniforms);
}
