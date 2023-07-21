# Naming conventions and typescript rules

## Naming conventions

No real/complete naming convention yet.

- Types in the lib will be named like this: `SubscriptionDetailBase` and `SubscriptionTableBase` 

# Typescript rules

These rules were added in ADR0002

- We will have some basic type definitions in the lib: Subscriptions, Subscription, Processes, Process
- We will not use the generated grap[hqltypes direct in the components; instead we map it to and from generated types
- We assume that most users will only want to add columns/fields in Subscriptions, Subscription, Processes, Process
- We assume that certain fields are not changeable, for example fields that are used by workflow engine related objects;
    like workflow status, subscription status.
- When components can be extended GenericFields will be used to extend Base types. Components should implement 
    functionality to render extra attributes/fields.
