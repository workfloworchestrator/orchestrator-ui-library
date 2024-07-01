/**
 * Dynamic Forms
 *
 * A hidden input component
 */
import { DropDown } from '@some-ui-lib';

import DfFieldWrap from '@/components/fields/Wrap';
import { FormComponent, IDFInputFieldProps } from '@/types';

function DFNoOptionsEnumWrap({ field }: IDFInputFieldProps) {
    return (
        <DfFieldWrap field={field}>
            <DropDown
                placeholder={'Er zijn geen opties beschikbaar'}
                disabled={true}
                options={[]}
                value={null}
            />
        </DfFieldWrap>
    );
}

const DFNoOptionsEnum: FormComponent = {
    Element: DFNoOptionsEnumWrap,
};

export default DFNoOptionsEnum;
