/**
 * Dynamic Forms
 *
 * A simple text field with type number
 */

import { TextField } from "@some-ui-lib/dist/components/Form/TextField"
import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"
import DfFieldWrap from "~dynamicForms/components/fields/Wrap"
import { useDynamicFormsContext } from "~dynamicForms/core"
import {
	FormComponent,
	IDFInputFieldProps,
	IDynamicFormField,
} from "~dynamicForms/types"

function DhfCtrldTextField(dfFieldConfig: IDynamicFormField) {
	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		return (
			<DfFieldWrap field={dfFieldConfig}>
				<TextField
					value={field.value ?? ""}
					onChangeValue={field.onChange}
					type="number"
					disabled={!!dfFieldConfig.attributes.disabled}
				/>
			</DfFieldWrap>
		)
	}
}

function DFNumberFieldWrap({ field }: IDFInputFieldProps) {
	const { rhf } = useDynamicFormsContext()

	return (
		<Controller
			control={rhf.control}
			name={field.id}
			render={DhfCtrldTextField(field)}
		/>
	)
}

const DFNumberField: FormComponent = {
	Element: DFNumberFieldWrap,
	validator: () => z.number(),
}

export default DFNumberField
