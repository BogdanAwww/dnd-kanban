export interface DragData {
  type: string;
  id: string;
  [key: string]: any;
}

export interface DropResult {
  source: { data: DragData };
  location: {
    element: HTMLElement | null;
    [key: string]: any;
  };
}
