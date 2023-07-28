# ADR 0003 - Next JS

Date: 2023-06-30

## Status

*Accepted*

## Decisions

Initially we tried to make the components in lib so that they could be used form any react app. This resulted in some complex
code when components in the lib need access to functionality in the Next JS router or other Next JS functionality. 

We will also use Next JS for authentication, internationalisation and localisation. 

Decision: we will allow Next JS functionality inside the lib and assume that our users will implement their React app with Next JS.

## Action items

- Refactor components in the lib so the can use the Next JS router
- Start adding localisation
- Investigate [Next-Auth](https://next-auth.js.org/)

## Attendees

- Hans Trompert
- René Dohmen
- Ricardo van der Heijden
- Ruben van Leeuwen
