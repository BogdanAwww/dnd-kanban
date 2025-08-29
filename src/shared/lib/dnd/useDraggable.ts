import { useEffect } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { DragData } from "./types";

interface UseDraggableConfig {
  ref: React.RefObject<HTMLElement>;
  data: DragData;
  onDragStart?: () => void;
  onDrop?: () => void;
}

export function useDraggable({ ref, data, onDragStart, onDrop }: UseDraggableConfig) {
  useEffect(() => {
    const el = ref.current;
    invariant(el, "Draggable element not found");

    return draggable({
      element: el,
      getInitialData: () => data,
      onDragStart,
      onDrop,
    });
  }, [ref, data, onDragStart, onDrop]);
}
