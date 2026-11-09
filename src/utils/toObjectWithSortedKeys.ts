// Some components in this project need the keys of an object to be in a certain order
// This function sorts the keys of an object based on an array of strings
// Keys that do not exist in the object will be ignored
export const toObjectWithSortedKeys = <T extends object>(inputObject: T, keyOrder: string[]): T => {
  const allInputObjectKeys = Object.keys(inputObject) as Array<keyof T>;
  allInputObjectKeys.sort((left, right) => {
    const leftIndex = keyOrder.indexOf(left.toString());
    const rightIndex = keyOrder.indexOf(right.toString());

    if (leftIndex === -1 && rightIndex === -1) {
      return 0;
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });

  // Using all keys from the input object means the result will contain all keys of T, meaning the type is T
  return allInputObjectKeys.reduce((acc, key) => {
    acc[key] = inputObject[key];
    return acc;
  }, {} as T);
};
