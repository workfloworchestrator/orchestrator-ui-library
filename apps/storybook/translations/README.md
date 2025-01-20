## Adding or overriding translations

The standard Wfo component library has translations included, they can be found in messages folder of the @orchestrator-ui/orchestrator-ui-components library. The translations that are provided in this folder (wfo-ui/translations) are merged into these standard translations, this allows for adding to and overriding of the standard translations with the custom ones provided.
Overriding happens on a per key basis

_example_
The standard library in en-GB.json provides

```
{
  metadata: {
    product: {
      name: 'Name',
      description: 'Description'
    }
  }
}
```

A file in this folder with the same locale 'en-GB.json' provides

```
{
  metadata: {
    product: {
      name: 'A better name'
    }
  }
}

```

The resulting translation keys and messages that are used is

```
{
  metadata: {
    product: {
      name: 'A better name',
      description: 'Description'
    }
  }
}
```

### Form label translations

Forms provide translations that are used when displaying form elements. They are retrieved dynamically by calling
the `translations/${locale}` endpoint. From the json result of this call the data in the `forms.fields` key is merged into
the translations under the `pydanticForms.backendTranslations` key. These translations are referenced when rendering form input
elements.

The final translation dictionary will look like this

```
{
  metadata: {
    product: {
      name: 'A better name',
      description: 'Description'
    }
  }
  pydanticForms: {
    ...
    backendTranslations: {
        ... `form.fields` result from `translations/${locale}` call

    }
  }
}
```
