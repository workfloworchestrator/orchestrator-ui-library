/** Joins class names and skips empty values, so a conditional class can be `isActive && styles.active`. */
export const joinClassNames = (...classNames: (string | false | null | undefined)[]): string =>
  classNames.filter(Boolean).join(' ');
