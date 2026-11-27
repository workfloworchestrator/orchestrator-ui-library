---
"@orchestrator-ui/orchestrator-ui-components": minor
---

New start page summary cards, built on a first set of design system parts

- `WfoSummaryCards` shows the cards in a grid of up to 3 columns. Users can drag the cards into a new order (also with the keyboard), open and close them one by one or all at once, and reset the order. The order and the open cards are saved in the browser. Every card needs a unique `key`; in development the console shows an error when one is missing. New optional prop `storageKey`, for a second `WfoSummaryCards` on the same site.
- `WfoSummaryCard` opens and closes. New props: `color` (`success` green, `info` blue, `warning` orange, `danger` red; default `info`) and `icon` (your own icon in the tile). You decide which color fits.
- Design tokens: `--wfo-*` CSS variables for light and dark mode. The library imports its own `dist/index.css`, so apps need no change. `WfoPageTemplate` sets the mode; without it, set `data-wfo-color-mode` on `<html>`, or the OS setting decides.
- Design system parts, without EUI: `WfoGrid` (`gap`), `WfoPanel` (`padding`; both take a space token like `200`), `WfoCollapsible*`, `WfoButton` (variants `primary`, `secondary`, `ghost`; color `danger`; sizes; icon at start or end; `isLoading`; `isFullWidth`), `WfoLink`, `WfoList`, `WfoSortableList` (with translatable screen reader `announcements`), `WfoSortableItem` (with its own drag handle), `WfoSpinner`, `WfoSkeleton` and `WfoIconTile` (`color`).
- Prop names in the design system: `variant` (how it is drawn), `color` (the color set by meaning), `size`.
- Fix: `WfoExclamationTriangle` was smaller than its box and not centered. It now fills its box like the other icons, so it looks a little bigger.

**Nothing breaks.** The items below still work and look the same, but they are deprecated and will be removed in the next major version. In development, the console shows a warning once, with what to use instead.

| Deprecated                    | Use instead                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `WfoSummaryCard headerStatus` | `color`: `Success` → `"success"`, `Error` → `"danger"`, `Neutral` → `"info"`      |
| `WfoSummaryCard headerBadge`  | `icon={<YourIcon />}`; the tile color comes from `color`                          |
| `WfoSummaryCardHeader`        | `WfoSummaryCard` (props `color` and `icon`), or `WfoIconTile` in your layout      |
| `WfoSummaryCardList`          | `WfoList`                                                                         |
| `WfoSummaryCardListItem`      | `WfoListItem` inside a `WfoList`, with a `WfoLink` for a link                     |
| `getNumberOfColumns`          | `WfoGrid` with `maxColumns`                                                       |
