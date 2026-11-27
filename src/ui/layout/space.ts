/** A step of the space scale: the number of a `--wfo-space-*` token, or 0. Layout parts take it for padding and gap. */
export type WfoSpace = 0 | 50 | 100 | 150 | 200 | 300;

export const toSpaceValue = (space: WfoSpace) => (space === 0 ? '0' : `var(--wfo-space-${space})`);
