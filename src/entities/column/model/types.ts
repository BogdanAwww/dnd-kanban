export type ColumnStatus = 'todo' | 'in-progress' | 'done';

export interface Column {
  id: string;
  title: string;
  status: ColumnStatus;
  cardIds: string[];
  boardId: string;
  position: number;
}

export interface ColumnState {
  columns: Column[];
}

export const COLUMN_CONFIGS: { status: ColumnStatus; title: string; color: string }[] = [
  { status: 'todo', title: 'To Do', color: 'bg-gray-100 text-gray-800' },
  { status: 'in-progress', title: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { status: 'done', title: 'Done', color: 'bg-green-100 text-green-800' },
];