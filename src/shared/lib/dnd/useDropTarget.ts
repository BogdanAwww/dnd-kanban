import { useEffect } from "react";
import invariant from "tiny-invariant";
import { dropTargetForElements, GetFeedbackArgs } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { DropResult } from "./types";

interface UseDropTargetConfig {
  ref: React.RefObject<HTMLElement>;
  onDrop?: (result: DropResult) => void;
  canDrop?: (source: GetFeedbackArgs) => boolean;
}

export function useDropTarget({ ref, onDrop, canDrop }: UseDropTargetConfig) {
  useEffect(() => {
    const el = ref.current;
    invariant(el, "Drop target element not found");

    return dropTargetForElements({
      element: el,
      canDrop,
      onDrop,
    });
  }, [ref, onDrop, canDrop]);
}
