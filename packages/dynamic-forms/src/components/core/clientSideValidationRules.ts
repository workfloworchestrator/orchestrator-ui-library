/**
 * Dynamic Forms
 *
 * Client side validation rules
 *
 * ZOD: https://zod.dev/
 * ZOD react-hook-form: https://github.com/react-hook-form/resolvers?tab=readme-ov-file#zod
 */

import { IDynamicFormField } from "~dynamicForms/types"
import { z } from "zod"

const clientSideValidationRule = (field: IDynamicFormField) => {
	let validationRule = field?.validator?.(field) ?? z.string()

	if (!field.required) {
		validationRule = validationRule.optional()
	}

	if (field.validation.isNullable) {
		validationRule = validationRule.nullable()
	}

	return validationRule
}

export default clientSideValidationRule
