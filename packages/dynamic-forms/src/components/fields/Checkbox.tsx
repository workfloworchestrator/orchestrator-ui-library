/**
 * Dynamic Forms
 *
 * Checkbox component
 *
 * Generates a list of checkbox options based on the options in the field config
 */

import { CheckBox } from "@some-ui-lib"
import { ChangeEvent, useRef } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"
import DfFieldWrap from "~dynamicForms/components/fields/Wrap"
import { DFFieldController } from "~dynamicForms/components/render/DfFieldController"
import { FormComponent, IDynamicFormField } from "~dynamicForms/types"

function DhfCtrldDFCheckboxField(dfFieldConfig: IDynamicFormField) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fieldValueRef = useRef<any[]>([])

	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		fieldValueRef.current = field.value ?? []

		function changeHandler(fieldValue: string) {
			return (e: ChangeEvent<HTMLInputElement>) => {
				const curval = fieldValueRef.current ?? []

				if (e.target.checked) {
					field.onChange([...curval, fieldValue])
				} else {
					field.onChange(curval.filter((val) => val !== fieldValue))
				}
			}
		}

		return (
			<DfFieldWrap field={dfFieldConfig}>
				{dfFieldConfig.options.map((option) => (
					<CheckBox
						key={dfFieldConfig.id + option}
						label={option}
						checked={fieldValueRef.current.includes(option)}
						value={option}
						onChange={changeHandler(option)}
						disabled={!!dfFieldConfig.attributes.disabled}
						name={dfFieldConfig.id}
					/>
				))}
			</DfFieldWrap>
		)
	}
}

const DFCheckboxField: FormComponent = {
	Element: DFFieldController(DhfCtrldDFCheckboxField),
	validator: () => z.array(z.string()),
}

export default DFCheckboxField
