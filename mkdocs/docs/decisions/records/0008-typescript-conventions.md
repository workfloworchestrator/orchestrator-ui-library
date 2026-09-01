# ADR 0008 - TypeScript conventions

- **Status:** Final
- **Date:** 2024-07-25

## Decisions/Considerations

This ADR seeks to clarify a few TypeScript conventions that we want to follow:

- Always use the `FC` type from React for applying component props
- Use **interface** when applying component props, and use **type** for anything else

  ```ts
  import { FC } from 'react';

  interface ComponentProps {
    // ...
  }

  export const Component: FC<ComponentProps> = () => {
    // ...
  };
  ```

## Action items

None

## Proposer

- Ruben van Leeuwen
- Ricardo van der Heijden
- Georgi Manev
