# ADR Proposal on types

Date: 2023-08-07

## Status

*Proposal*

## Decisions/Considerations

This proposal seeks to update, clarify and change the types setup. The current setup of the types system is described in ADR 0002-typescript-rules. It states

- We will have some basic type definitions in the lib: Subscriptions, Subscription, Processes, Process
- We will not use the generated GraphQLtypes direct in the components; instead we map it to and from generated types
- We assume that most users will only want to add columns/fields in Subscriptions, Subscription, Processes, Process
- We assume that certain fields are not changeable, for example fields that are used by workflow engine related objects;
  like workflow status, subscription status.
- When components can be extended GenericFields will be used to extend Base types. Components should implement
  functionality to render extra attributes/fields.

When implementing these decisions we have created a structure where we have base types for these entities in 
packages/orchestrator-ui-components/src/types.ts

- CustomerBase
- ProductBase 
- ResourceTypeBase
- ProductBlockBase
- FixedInputsBase
- ExternalServiceBase
- SubscriptionDetailBase

All of these Base types can be extended with GenericFields that have the form ```{ [key: string]: number | string | boolean };```

Some confusion exists when some of these types are reused. For example: A subscription contains ProductBlocks, the ProductBlocks inside a subscription have these fields

```
    id: number;
    ownerSubscriptionId: string;
    parent: Nullable<number>;
    resourceTypes: ResourceTypeBase;
```

While the ProductBlock inside a Product have these fields

```
    productBlockId: string;
    name: string;
    tag: string;
    description: string;
    status: string;
    createdAt: Date | null;
    endDate: Date | null;
    resourceTypes: ResourceTypeDefinition[];
```

The reason is that inside a Subscription we are dealing with an instance of a ProductBlock and inside a Product we are dealing with a definition of it. 

To improve this situation 2 remedies are proposed. 

- Changes are made to the shape of Subscriptions returned by GraphQL 
  - ProductBlocks are renamed to productBlockInstances
  - Resource types are renamed productBlockInstanceValues and changed from one object to an array of key/value pairs
- Types are renamed to signify the difference between definitions and values. The following Definition types are added
  - ProductBlockDefinition
  - ProductDefinition
  - ResourceTypeDefinition
  - FixedInputDefinition
- Remove the corresponding *Base types if they no longer serve a purpose

After consultation and discussion with @tjeerd and @mark the consensus was reached that the Definition types are not extendable, that is we will not accommodate for the situation that a Definition type is extended by someone consuming our package. Such extensions are not accounted for in the backend so are unlikely to ever occur in the frontend package. This means we will not apply the GenericField pattern to Definition types. 

I think this is just a clarification of the original ADR where it already says only Subscriptions and Processes are able to be extended. 

*Generated types*
A decision was made export complete pages from the *orchestrator-ui-components* package and have the *app* implement the configuration of the GraphQL client and pass that down to pages. This poses some considerations for the way type generation is organized since they are generated in the app but are consumed in the package. 

Types are generated using the tool [codegen](https://the-guild.dev/graphql/codegen). Running the tool generates a folder called *__genarated__* that contains files that contain generated files used to:
- Generate types. The types generated are a bit unreadable and in some cases not precise. We solve this by mapping the types to our own independently defined types
- Type return values for functions that call GraphQL. 
- Makings sure that changes in the shape of GraphQL return values are detected. 
- 
In the current setup any changes made in Graphql queries require the types and function to be regenerated to work.

This proposal suggests to change the current way generated types are used. 

Proposal
- Stop using generated types directly. Only rely on the types we create manually, so no more mapping
- Stop using the generated function signatures. It's possible to type the return GraphQL return values manually, see code for examples
- Create a separate script that validates our manual types against the GraphQl endpoint separately. This script can run from the app and be part of the deployment steps so any changes in GraphQL can be caught during deploy

## Action items
- Write a script that validates that the manually created types still match the GraphQL schema
- Update the shape of Subscription to use the ProductBlockInstance and ProductBlockInstanceValues property names
- Update the types used to conform to this ADR.

## Proposer
- Ruben van Leeuwen


