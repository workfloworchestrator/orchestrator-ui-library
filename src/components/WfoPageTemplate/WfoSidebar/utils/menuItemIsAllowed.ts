export const menuItemIsAllowed = (
  url: string | undefined,
  urlPolicyMap: Map<string, string>,
  isAllowedHandler: (resource?: string) => boolean,
) => {
  if (!url) {
    return true;
  }

  const policyResource = urlPolicyMap.get(url);

  return policyResource ? isAllowedHandler(policyResource) : true;
};
