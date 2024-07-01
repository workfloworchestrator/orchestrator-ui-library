/**
 * Dynamic Forms
 *
 * Helper functions to be used in DynamicForms
 */

import fieldsConfig from "~dynamicForms/components/config"
import {
	IDynamicForm,
	IDynamicFormApiErrorResponse,
	IDynamicFormApiResponsePropertyResolved,
	IDynamicFormField,
	IDynamicFormFieldAttributes,
	IDynamicFormFieldSection,
	IDynamicFormFieldValidation,
} from "~dynamicForms/types"

/**
 * Error object formatting
 *
 * @param apiErrorResp The JSON Schema from the backend
 * @returns A object better usable for displaying errors
 */
export const getErrorDetailsFromResponse = function (
	apiErrorResp: IDynamicFormApiErrorResponse,
) {
	return {
		detail: apiErrorResp.detail ?? "",
		source: apiErrorResp.validation_errors,
		mapped: apiErrorResp.validation_errors.reduce((old, cur) => {
			return {
				...old,
				[cur.loc[0]]: {
					value: cur.input,
					msg: cur.msg,
				},
			}
		}, {}),
	}
}

/**
 * Easy pluk options or format from the anyOf, allOf or oneOf keys
 *
 * @param field A field from the 'properties' key of the JSON Schema
 * @returns anyOf, allOf, or allOf value
 */
export const getFieldAllOfAnyOfEntry = (
	field: IDynamicFormApiResponsePropertyResolved,
) => {
	const optionFields = [field.anyOf, field.oneOf, field.allOf]

	for (const optionsDefs of optionFields) {
		if (!optionsDefs) {
			continue
		}

		return optionsDefs
	}
}

/**
 * Field to field options
 *
 * @param field A field from the 'properties' key of the JSON Schema
 * @returns an array of options in strings
 */
export const getFieldOptions = (
	field: IDynamicFormApiResponsePropertyResolved,
) => {
	let isOptionsField = false
	const options = []

	const optionDef = getFieldAllOfAnyOfEntry(field)

	const fieldEnums = field.enum ?? field.items?.enum
	if (fieldEnums) {
		isOptionsField = true
		options.push(...fieldEnums)
	}

	const hasEntryWithEnums = optionDef?.filter(
		(option) => !!option.items?.enum || option?.enum,
	)

	if (field.items) {
		isOptionsField = true
	}

	if (!optionDef) {
		return {
			options,
			isOptionsField: false,
		}
	}

	for (const entry of optionDef) {
		if (entry.type === "null" && hasEntryWithEnums) {
			continue
		}

		if (entry.items) {
			isOptionsField = true
		}

		if (entry.items?.enum) {
			isOptionsField = true
			// add all the other options to the options arr
			options.push(...entry.items.enum)
		}

		if (entry?.enum) {
			isOptionsField = true
			// add all the other options to the options arr
			options.push(...entry.enum)
		}
	}

	return {
		options,
		isOptionsField,
	}
}

export const getFieldLabelById = (fieldId: string, formData: IDynamicForm) => {
	const field = formData.fields.filter((field) => field.id === fieldId)
	return field?.[0].title || fieldId
}

/**
 * Field to validation object
 *
 * @param field A field from the 'properties' key of the JSON Schema
 * @returns returns a validation object
 */
export const getFieldValidation = (
	field: IDynamicFormApiResponsePropertyResolved,
) => {
	const validation: IDynamicFormFieldValidation = {}

	const optionDef = getFieldAllOfAnyOfEntry(field)

	const isNullable = optionDef?.filter((option) => option.type === "null")

	if (isNullable) {
		validation.isNullable = true
	}

	for (const option of [field, ...(optionDef ?? [])]) {
		if (option.maxLength) validation.maxLength = option.maxLength
		if (option.minLength) validation.minLength = option.minLength
		if (option.pattern) validation.pattern = option.pattern
	}

	return validation
}

/**
 * Sort field per section for displaying
 *
 * This function will organize the fields per section
 * every time a field comes by that starts with label_
 * we start a new section
 */
export const getFieldBySection = (fields: IDynamicFormField[]) => {
	const sections: IDynamicFormFieldSection[] = []
	let curSection = 0

	for (const field of fields) {
		if (field.id.startsWith("label_")) {
			curSection++
			sections.push({
				id: field.id,

				// strange as it is, the backend will put the
				// correct label in the 'default' prop
				title: field.default ?? field.title,

				fields: [],
			})

			continue
		}

		if (curSection === 0) {
			// if we are here there was no first label field,
			// we'll create a label / section to prevent errors

			sections.push({
				id: "auto-created-section",
				title: "",
				fields: [],
			})

			// Make sure new fields are pushed into this section and
			// prevent empty sections created
			curSection = 1
		}

		// since we start at 0, and the first label will add
		const targetSection = curSection - 1

		sections[targetSection].fields.push(field.id)
	}

	return sections
}

/**
 * Will return a Record map of [fieldId]: "Fieldvalue"
 *
 * Requires both fieldsDef (these can have default values)
 * And labelData (this holds the current values from API)
 */
export const getFormValuesFromFieldOrLabels = (
	fields: IDynamicFormField[],
	labelData?: Record<string, string>,
) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fieldValues: Record<string, any> = {}

	const includedFields: string[] = []

	for (const field of fields) {
		includedFields.push(field.id)

		if (typeof field.default === "undefined") {
			continue
		}

		fieldValues[field.id] = field.default
	}

	if (labelData) {
		for (const fieldId in labelData) {
			if (labelData[fieldId] && includedFields.includes(fieldId)) {
				fieldValues[fieldId] = labelData[fieldId]
			}
		}
	}

	return fieldValues
}

/**
 * Match a FormField config with an actual field from the config
 */
export const matchComponentWithField = function (field: IDynamicFormField) {
	return fieldsConfig.find((possibleField) => {
		if (!possibleField.matcher) {
			return true
		}

		return possibleField.matcher(field)
	})
}

/**
 * Finds and returns the attributes in the schemafield
 */
export const getFieldAttributes = function (
	schemaField: IDynamicFormApiResponsePropertyResolved,
) {
	const attributes: IDynamicFormFieldAttributes = {}

	if (schemaField.uniforms?.disabled) {
		attributes.disabled = true
	}

	return attributes
}
