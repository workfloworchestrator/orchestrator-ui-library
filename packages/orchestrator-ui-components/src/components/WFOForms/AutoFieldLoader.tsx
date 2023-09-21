import {
    BoolField,
    DividerField,
    LabelField,
    LongTextField,
    NumField,
    SelectField,
    TextField,
} from './formFields';
import { Context, GuaranteedProps } from 'uniforms';
import { AutoField } from 'uniforms-unstyled';

export function autoFieldFunction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: GuaranteedProps<unknown> & Record<string, any>,
    uniforms: Context<unknown>,
) {
    const { allowedValues, fieldType, field } = props;
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
                case 'long':
                    return LongTextField;
                case 'label':
                    return LabelField;
                case 'divider':
                    return DividerField;
            }
            break;
    }
    if (allowedValues && format !== 'accept') {
        return SelectField;
    } else {
        switch (fieldType) {
            case Boolean:
                return BoolField;
            case Number:
                return NumField;
            case String:
                return TextField;
        }
    }

    // Todo React upgrade: fix uniform types
    // @ts-ignore
    return AutoField.defaultComponentDetector(props, uniforms);
}
