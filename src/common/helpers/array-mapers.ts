import { removeProperties } from './remove-properties';

export const mapAndRemoveProperties = <T>(
  array: T[],
  propertiesToRemove: string[],
): T[] => {
  return array.map((obj) => removeProperties<T>(obj, propertiesToRemove));
};
