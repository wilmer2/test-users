export const removeProperties = <T>(
  obj: T,
  propertiesToRemove: string[],
): T => {
  const newObj: T = { ...obj };

  propertiesToRemove.forEach((property) => {
    if (newObj.hasOwnProperty(property)) {
      delete newObj[property];
    }
  });

  return newObj;
};
