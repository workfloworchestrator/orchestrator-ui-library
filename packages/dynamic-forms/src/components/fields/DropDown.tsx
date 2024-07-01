/**
 * Dynamic Forms
 *
 * Dropdown component
 */

import {
	DropDown,
	DropDownOption,
} from "@some-ui-lib/dist/components/Form/DropDown"
import { useCallback } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"
import DfFieldWrap from "~dynamicForms/components/fields/Wrap"
import { DFFieldController } from "~dynamicForms/components/render/DfFieldController"
import { FormComponent, IDynamicFormField } from "~dynamicForms/types"

function DhfCtrldDropDown(dfFieldConfig: IDynamicFormField) {
	const options = dfFieldConfig.options.map((option) => ({
		label: option,
		value: option,
	}))

	return function DropDownField({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		const valueChange = useCallback(
			(option: DropDownOption) => {
				field.onChange(option.value, dfFieldConfig.id)
			},
			[field],
		)

		return (
			<DfFieldWrap field={dfFieldConfig}>
				<DropDown
					onChange={valueChange}
					options={options}
					value={field.value ?? ""}
					placeholder={"Maak een keuze"}
					disabled={!!dfFieldConfig.attributes.disabled}
					width={"100%"}
				/>
			</DfFieldWrap>
		)
	}
}

const DFDropDown: FormComponent = {
	Element: DFFieldController(DhfCtrldDropDown),
	validator: () => z.string(),
}

export default DFDropDown
