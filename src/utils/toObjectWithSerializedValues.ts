export const toObjectWithSerializedValues = <T extends object>(inputObject: T) => {
  const entries = Object.entries(inputObject);
  const mappedEntries = entries.map(([key, value]) => {
    if (value !== null && value.constructor !== Date && typeof value === 'object') {
      return [key, JSON.stringify(value)];
    }
    return [key, value];
  });

  return Object.fromEntries(mappedEntries);
};
