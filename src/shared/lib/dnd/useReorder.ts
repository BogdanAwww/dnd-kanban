import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';

export function useReorder<T extends { id: string }>(
  items: T[],
  startId: string,
  destId: string
): T[] {
  const startIndex = items.findIndex((item) => item.id === startId);
  const destIndex = items.findIndex((item) => item.id === destId);

  if (startIndex === -1 || destIndex === -1) return items;

  return reorder({
    list: items,
    startIndex,
    finishIndex: destIndex,
  });
}
