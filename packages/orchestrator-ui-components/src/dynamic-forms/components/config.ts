/**
 * Dynamic Forms
 *
 * We will search for the first field that returns a positive match
 * The last field has no matcher, so it will match as the default
 */
import DFDateTime from '@/dynamic-forms/components/fields/DateTime';
import DFDropDown from '@/dynamic-forms/components/fields/DropDown';
import DFHiddenField from '@/dynamic-forms/components/fields/Hidden';
import DFListField from '@/dynamic-forms/components/fields/List';
import DFRadioField from '@/dynamic-forms/components/fields/Radio';
import DFSkipField from '@/dynamic-forms/components/fields/Skip';
import DFSwitchField from '@/dynamic-forms/components/fields/Switch';
import DFTextField from '@/dynamic-forms/components/fields/Text';
import DFTextAreaField from '@/dynamic-forms/components/fields/TextArea';
import {
    DfFieldFormats,
    DfFieldTypes,
    DfFieldsConfig,
} from '@/dynamic-forms/types';

const fieldsConfig: DfFieldsConfig = [
    {
        id: 'hiddenfield',
        Component: DFHiddenField,
        matcher(field) {
            return field.format === DfFieldFormats.HIDDEN;
        },
        preventColRender: true,
    },

    {
        id: 'datetimepicker',
        Component: DFDateTime,
        matcher(field) {
            return [DfFieldFormats.DATETIME, DfFieldFormats.TIMESTAMP].includes(
                field.format,
            );
        },
    },
    {
        id: 'switch',
        Component: DFSwitchField,
        matcher(field) {
            // boolean fields will use switch
            if (field.type === DfFieldTypes.BOOLEAN) {
                return true;
            }

            // fields with array of options dont fit
            if (field.type === DfFieldTypes.ARRAY) {
                return false;
            }

            // use switch only when 2 options and their values are max then 4 chars
            return (
                field.options.length === 2 &&
                field.options.filter((option) => option.length < 5).length === 2
            );
        },
    },
    {
        id: 'radio',
        Component: DFRadioField,
        matcher(field) {
            // fields with array of options dont fit
            if (field.type !== DfFieldTypes.STRING) {
                return false;
            }

            // use radio when between 1 and 5 options
            return field.options.length > 1 && field.options.length < 6;
        },
    },

    {
        id: 'dropdown',
        Component: DFDropDown,
        matcher(field) {
            return (
                field.type === DfFieldTypes.STRING && field.options.length > 1
            );
        },
    },

    {
        id: 'list',
        Component: DFListField,
        matcher(field) {
            return (
                field.type === DfFieldTypes.ARRAY && field.options.length === 0
            );
        },
    },

    {
        id: 'skip',
        Component: DFSkipField,
        matcher(field) {
            return field.format === DfFieldFormats.SKIP;
        },
    },

    {
        id: 'textarea',
        Component: DFTextAreaField,
        matcher(field) {
            return field.format === DfFieldFormats.LONG;
        },
    },
    // no matcher, last in array,
    // so its the final fallback
    {
        id: 'textfield',
        Component: DFTextField,
    },
];

export default fieldsConfig;
