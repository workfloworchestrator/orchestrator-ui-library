# ADR 0003 - Next.js

- **Status:** Accepted
- **Date:** 2023-06-30

## Decisions

Initially we tried to make the components in the library so that they could be used from any React app. This resulted in some complex code when components in the library needed access to functionality in the Next.js router or other Next.js functionality.

We will also use Next.js for authentication, internationalisation, and localisation.

Decision: we will allow Next.js functionality inside the library and assume that our users will implement their React app with Next.js.

## Action items

- Refactor components in the library so they can use the Next.js router
- Start adding localisation
- Investigate [NextAuth](https://next-auth.js.org/)

## Attendees

- Hans Trompert
- René Dohmen
- Ricardo van der Heijden
- Ruben van Leeuwen
