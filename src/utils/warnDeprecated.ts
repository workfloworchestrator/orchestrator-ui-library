const shownDeprecations = new Set<string>();

/**
 * Tells developers in the console that they use something deprecated, and what to use instead.
 * Once per name, and never in production.
 */
export const warnDeprecated = (deprecatedName: string, replacement: string) => {
  if (process.env.NODE_ENV === 'production' || shownDeprecations.has(deprecatedName)) return;
  shownDeprecations.add(deprecatedName);
  console.warn(
    `[@orchestrator-ui/orchestrator-ui-components] ${deprecatedName} is deprecated and will be removed in the next major version. ${replacement}`,
  );
};
