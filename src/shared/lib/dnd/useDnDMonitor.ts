import { useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { DropResult } from "./types";

interface UseDnDMonitorConfig {
  onDrop?: (result: DropResult) => void;
  onDragStart?: (data: any) => void;
  onDragEnd?: (data: any) => void;
}

export function useDnDMonitor({ onDrop, onDragStart, onDragEnd }: UseDnDMonitorConfig) {
  useEffect(() => {
    return monitorForElements({
      onDragStart,
      onDrop,
      onDragEnd,
    });
  }, [onDrop, onDragStart, onDragEnd]);
}
