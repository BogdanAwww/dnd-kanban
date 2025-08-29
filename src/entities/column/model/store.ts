import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Column, ColumnState, ColumnStatus } from './types';
import { useCardStore } from '../../card';

interface ColumnStore extends ColumnState {
  // Actions
  createColumn: (title: string, status: ColumnStatus, boardId: string, position?: number) => string;
  updateColumn: (id: string, updates: Partial<Pick<Column, 'title' | 'position'>>) => void;
  deleteColumn: (id: string) => void;
  addCardToColumn: (columnId: string, cardId: string) => void;
  removeCardFromColumn: (columnId: string, cardId: string) => void;
  moveCardBetweenColumns: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  getColumnsByBoard: (boardId: string) => Column[];
  getColumnByStatus: (boardId: string, status: ColumnStatus) => Column | undefined;
}

export const useColumnStore = create<ColumnStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        columns: [
          {
            id: 'col-1',
            title: 'To Do',
            status: 'todo',
            cardIds: ['card-1'],
            boardId: 'board-1',
            position: 0,
          },
          {
            id: 'col-2',
            title: 'In Progress',
            status: 'in-progress',
            cardIds: ['card-2'],
            boardId: 'board-1',
            position: 1,
          },
          {
            id: 'col-3',
            title: 'Done',
            status: 'done',
            cardIds: ['card-3'],
            boardId: 'board-1',
            position: 2,
          },
        ],

        // Actions
        createColumn: (title: string, status: ColumnStatus, boardId: string, position?: number) => {
          const columns = get().columns;
          const boardColumns = columns.filter(col => col.boardId === boardId);
          const newPosition = position ?? boardColumns.length;
          
          const newColumn: Column = {
            id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title,
            status,
            cardIds: [],
            boardId,
            position: newPosition,
          };
          
          set((state) => ({
            columns: [...state.columns, newColumn],
          }));
          
          return newColumn.id;
        },

        updateColumn: (id: string, updates: Partial<Pick<Column, 'title' | 'position'>>) =>
          set((state) => ({
            columns: state.columns.map((column) =>
              column.id === id
                ? { ...column, ...updates }
                : column
            ),
          })),

        deleteColumn: (id: string) => {
          const column = get().columns.find(col => col.id === id);
          if (!column) return;

          // Delete all cards in this column
          const { deleteCard } = useCardStore.getState();
          column.cardIds.forEach(cardId => {
            deleteCard(cardId);
          });

          set((state) => ({
            columns: state.columns.filter(col => col.id !== id),
          }));
        },

        addCardToColumn: (columnId: string, cardId: string) =>
          set((state) => ({
            columns: state.columns.map((column) =>
              column.id === columnId
                ? { 
                    ...column, 
                    cardIds: [...column.cardIds, cardId]
                  }
                : column
            ),
          })),

        removeCardFromColumn: (columnId: string, cardId: string) =>
          set((state) => ({
            columns: state.columns.map((column) =>
              column.id === columnId
                ? { 
                    ...column, 
                    cardIds: column.cardIds.filter(id => id !== cardId)
                  }
                : column
            ),
          })),

        moveCardBetweenColumns: (cardId: string, fromColumnId: string, toColumnId: string) =>
          set((state) => ({
            columns: state.columns.map((column) => {
              if (column.id === fromColumnId) {
                return {
                  ...column,
                  cardIds: column.cardIds.filter(id => id !== cardId),
                };
              }
              if (column.id === toColumnId) {
                return {
                  ...column,
                  cardIds: [...column.cardIds, cardId],
                };
              }
              return column;
            }),
          })),

        getColumnsByBoard: (boardId: string) => {
          return get().columns
            .filter(column => column.boardId === boardId)
            .sort((a, b) => a.position - b.position);
        },

        getColumnByStatus: (boardId: string, status: ColumnStatus) => {
          return get().columns.find(column => 
            column.boardId === boardId && column.status === status
          );
        },
      }),
      {
        name: 'column-state',
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            return JSON.parse(str);
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    ),
    { name: 'column-store' }
  )
);