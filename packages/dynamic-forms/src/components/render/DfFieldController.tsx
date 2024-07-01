/**
 * React hook form controller
 */

import { useDynamicFormsContext } from "~dynamicForms/core/dynamicFormContext"
import {
	Controller,
	ControllerFieldState,
	ControllerRenderProps,
	FieldValues,
	UseFormStateReturn,
} from "react-hook-form"
import { IDFInputFieldProps, IDynamicFormField } from "~dynamicForms/types"

type FieldComponent = (
	dfFieldConfig: IDynamicFormField,
) => ({
	field,
	fieldState,
	formState,
}: {
	field: ControllerRenderProps<FieldValues, string>
	fieldState: ControllerFieldState
	formState: UseFormStateReturn<FieldValues>
}) => React.ReactElement

export const DFFieldController = (FieldComponent: FieldComponent) => {
	return function DFFieldControllerWrap({ field }: IDFInputFieldProps) {
		const { rhf } = useDynamicFormsContext()

		return (
			<Controller
				name={field.id}
				control={rhf.control}
				render={FieldComponent(field)}
			/>
		)
	}
}
