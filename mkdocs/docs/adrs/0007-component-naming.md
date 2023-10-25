# ADR Proposal on component naming 

Date: 2023-10-24

## Status

*Final*

## Decisions/Considerations
This ADR seeks to clarify  the naming conventions around components in the orchestrator UI library. During the frontend meeting of 19-10-23 we have made some decisions relating to the naming of components and naming in general. They are:

TwoWord components will be named like so
-- ProductBlock
-- ResourceType
-- FixedInput
-- ProductTag
-- Workflow

All components in the Wfo package are named with the Wfo prefix.
-- This changes WFO where ever it's used to Wfo to align with abbr. rules used in the backend
-- Even components that are not exported are renamed. This has advantages including always showing up with the Wfo prefix in devtools and when searching for components in the code


## Action items
- Refactor codebase to align with this ADR

## Proposer
- Ruben van Leeuwen
- Rene Dohmen
- Ricardo van der Heijden
- Tjeerd Verschragen


