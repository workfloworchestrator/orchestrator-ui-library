export const getObjectKeys = <T extends object>(inputObject: T): Array<keyof T> =>
  Object.keys(inputObject) as Array<keyof T>;
