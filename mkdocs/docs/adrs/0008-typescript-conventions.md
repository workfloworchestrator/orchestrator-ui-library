# ADR Proposal on component naming 

Date: 2024-07-25

## Status

*Final*

## Decisions/Considerations
This ADR seeks to clarify a few typescript conventions that we want to follow. They are:

- Always use the FC type from react for applying component props
- Use **interface** when applying component props, use **type** for anything else

  ```
  import { FC } from 'react
  interface ComponentProps {
    ... 
  }  
  
  export const Component:FC<ComponentProps> = () => {
    ....
  }
```


## Action items
none

## Proposer
- Ruben van Leeuwen
- Ricardo van der Heijden
- Georgi Manev


