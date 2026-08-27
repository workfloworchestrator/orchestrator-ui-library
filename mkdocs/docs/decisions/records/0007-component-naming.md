# ADR 0007 - Proposal on component naming

- **Status:** Final
- **Date:** 2023-10-24

## Decisions/Considerations

This ADR seeks to clarify the naming conventions around components in the Orchestrator UI Library. During the frontend meeting of 2023-10-19, we made decisions relating to the naming of components and naming in general:

- Two-word components will be named using PascalCase: ProductBlock, ResourceType, FixedInput, ProductTag, and Workflow
- All components in the Wfo package are named with the `Wfo` prefix
- This changes WFO wherever it is used to Wfo to align with abbreviation rules used in the backend
- Even components that are not exported are renamed, so they always show up with the Wfo prefix in devtools and when searching for components in the code

## Action items

- Refactor the codebase to align with this ADR

## Proposer

- Ruben van Leeuwen
- René Dohmen
- Ricardo van der Heijden
- Tjeerd Verschragen
