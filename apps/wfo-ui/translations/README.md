## Adding or overriding translations

The standard WFO component library has translations included, they can be found in messages folder of the @orchestrator-ui/orchestrator-ui-components library. The translations that are provided in this folder (wfo-ui/translations) are merged into these standard translations, this allows for adding to and overriding of the standard translations with the custom ones provided.
Overriding happens on a per key basis

_example_
The standard library in en-US.json provides

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

A file in this folder with the same locale 'en-US.json' provides

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
