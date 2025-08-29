export interface Board {
  id: string;
  title: string;
  description?: string;
  columnIds: string[];
}

export interface BoardState {
  boards: Board[];
  activeBoard: Board | null;
}