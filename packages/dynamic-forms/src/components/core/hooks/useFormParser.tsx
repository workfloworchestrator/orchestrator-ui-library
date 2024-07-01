/**
 * Dynamic Forms
 *
 * A hook that will parse the received and parsed JSON Schema
 * to something more usable in the templates
 *
 * - Adds translations to fields
 * - Organizes the fields types and their options
 * - Marks required fields in their definition
 */

import { useMemo } from "react"
import { mapToUsableField } from "~dynamicForms/core"
import { getFieldBySection } from "~dynamicForms/core/helper"
import {
	IFieldDefinitionProvider,
	IDynamicForm,
	IDynamicFormApiRefResolved,
	IDynamicFormState,
	IDynamicFormsLabels,
} from "~dynamicForms/types"

export function useFormParser(
	schema?: IDynamicFormApiRefResolved,
	formLabels?: IDynamicFormsLabels,
	fieldDetailProvider?: IFieldDefinitionProvider,
): IDynamicForm | false {
	return useMemo(() => {
		if (!schema || !formLabels) return false

		const fieldIds = Object.keys(schema?.properties ?? {})

		const fields = fieldIds.map((fieldId) => {
			const fieldDef = mapToUsableField(fieldId, schema, formLabels)
			if (!fieldDetailProvider?.[fieldId]) {
				return fieldDef
			}

			return { ...fieldDef, ...fieldDetailProvider?.[fieldId] }
		})

		return {
			title: schema.title,
			description: schema.description,
			state: IDynamicFormState.NEW,
			fields,
			sections: getFieldBySection(fields),
		}
	}, [schema, formLabels, fieldDetailProvider])
}
