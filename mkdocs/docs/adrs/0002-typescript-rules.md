# ADR 0002 - Typescript guidelines and rules

Date: 2023-05-20

## Status

*Accepted*

## Decisions

You will have a lot of freedom regarding things like where the orchestrator gets its customer info, if any at all. A pragmatic
vision for the type system is needed as we want to keep the src code as type safe as possible.

Decided to start allow some types that are Orchestrator specific in the lib. To make it possible to extend and change the
re-usable components we want to define some rules to make the components in the lib flexible enough to adapt to some 
common business scenario's. 

## Action items

- We will have some basic type definitions in the lib: Subscriptions, Subscription, Processes, Process
- We will not use the generated GraphQLtypes direct in the components; instead we map it to and from generated types
- We assume that most users will only want to add columns/fields in Subscriptions, Subscription, Processes, Process
- We assume that certain fields are not changeable, for example fields that are used by workflow engine related objects;
  like workflow status, subscription status.
- When components can be extended GenericFields will be used to extend Base types. Components should implement
  functionality to render extra attributes/fields.

## Attendees

- René Dohmen
- Ricardo van der Heijden
