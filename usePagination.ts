import { useMemo } from 'react';

import { IPaginationOptions } from '../models/IPagination';

type PaginationRange = number[];

export const DOTS = -1;

const range = (start: number, end: number): number[] =>
  // Генерируем массив от стартового до конечного индекса
  // _ игнорирует число массива, используем только индекс
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: IPaginationOptions): PaginationRange => {
  const paginationRange: PaginationRange = useMemo(() => {
    // Общее количество страниц
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Количество отображаемых страниц
    // (точки, соседние страницы, первая и последняя, текущая)
    const totalPageNumbers = siblingCount + 5;

    // Если страниц ддя отображения больше, чем общее количество страниц,
    // то вернем все страницы
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    // Определяем соседние страницы для текущей
    // если текущая 5, то получим 4 и 6
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    // Определяем необходимость отображения точек
    // Если соседние страницы больше 2 элементов от первой и последней - отображаем
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    // Определяем первую и последнюю страницы для отображения
    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Если есть правые точки и нет левых точек
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 2 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    // Если есть левые точки и нет правых точек
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 2 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Если есть левые и правые точки
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
