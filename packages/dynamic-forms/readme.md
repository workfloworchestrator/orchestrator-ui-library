# Dynamic forms

To have forms agnostic of the frontend, we have a dynamic forms module that will render a form based on input from the backend.

The backend should response in the JsonSchema format.

## How to use

```jsx
<DynamicForm
	id="the_identifier_of_the_form"
	meta={{
		some: "metadata",
		yesh: {
			no: "ok",
			maybe: false,
		},
	}}
	// Below some optional fields
	formIdKey={`${company.id},${department_id}`}
	onSuccess={() => console.log("Form has been successfully submitted")}
	onCancel={() => console.log("user cancelled the form")}
	headerComponent={<div>Some element to show below the page title</div>}
/>
```

## Technical structure / How it works

In the DynamicForm component we add a context.
In this context we use some hooks to manage the state of the form.

### DynamicFormContext

The main form logic and state is kept in this context

### Field mapping

To map fields from the JSON Schema to a component we are analyzing the properties of the scheme.
We do this in the `core/schemaToFieldTypes.ts` file. Here we create a more usable object we use from here.

#### core/SchemaToFieldTypes.ts

In this file we are checking the field entry to determin what kind of data it holds and what the DfFieldType should be.

#### components/config.ts

Here we define when what field will be used. It holds and array and the **first item** where the **matcher function** returns **true**, will be used.
The final item is a TextField without matcher function, so that is the default field to be used if nothing else matches.

## Creating a new form component

A FormComponent should have a JSX component, that can work with react-hook-form. So it should be a controlled, and use their controller [documentation from react-hook-form](https://react-hook-form.com/docs/usecontroller/controller)

Maybe the easiest would be to just copy the <Text /> field file (`components/fields/Text.tsx`) and modify it to work for your component. Keep in mind that the RHF onChange handle expects a direct value, and not an event. So maybe you'll need to write your own changeHandler that presents the data correctly.

Each component should have an export of the `FormComponent` interface:

```jsx
const DFSomeCoolField: FormComponent = {
	Element: DFSomeCoolFieldWrap,

    // Validator is optional if you want to have validation!
	validator: (fieldConfig) => {
        // here you should return a ZOD validation rule.

        // a number between 5 and 25
        return z.number().gte(5).lte(25)

        // can have messages
        return z.number().gte(5, "At least 5").lte(25, "No more then 25")

        // can use field config
        return z.array(
            z.string()
            .min(
                field.validation.min,
                "ja je zit veeeel te laag!"
            )
            .max(
                field.validation.max,
                "ja en nu een beetje hoog!"
            )
        )
    }
}

export default DFSomeCoolField
```

## Validation

### Client-side validation

Each component has the option to add custom validation. The validation is defined at the component level.

We have implemented [ZOD](https://zod.dev/), use the format as defined above in the "Creating form component" section.

There is an option for presets when we have validation that will be reused in multiple components.

This is defined in: `components/zodValidations.ts`. Keep in mind these rules will be used in multiple files.
ZOD is chainable validation, so in a component, you can use the preset, and chain more validations onto it.

### Server side validation

Whenever the server side call response with validation errors, these overwrite the client-side errors.
