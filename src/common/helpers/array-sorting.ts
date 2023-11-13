import { SortOrder } from '../interfaces/sort-order.interface';

export const sortArrayByProperty = <T>(
  array: T[],
  property: string,
  sortOrder: SortOrder = SortOrder.Asc,
): T[] => {
  const sortedArray = [...array];

  sortedArray.sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    if (aValue === bValue) {
      return 0;
    }

    if (sortOrder === SortOrder.Asc) {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  return sortedArray;
};
