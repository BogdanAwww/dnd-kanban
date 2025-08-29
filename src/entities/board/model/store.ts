import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Board, BoardState } from './types';

interface BoardStore extends BoardState {
  // Actions
  createBoard: (title: string, description?: string) => string;
  updateBoard: (id: string, updates: Partial<Pick<Board, 'title' | 'description'>>) => void;
  deleteBoard: (id: string) => void;
  setActiveBoard: (board: Board | null) => void;
  addColumnToBoard: (boardId: string, columnId: string) => void;
  removeColumnFromBoard: (boardId: string, columnId: string) => void;
}

export const useBoardStore = create<BoardStore>()(
  devtools(
    (set, get) => ({
      // Initial state
              boards: [
          {
            id: 'board-1',
            title: 'My Project Board',
            description: 'Main project tasks and workflow',
            columnIds: ['col-1', 'col-2', 'col-3'],
          },
        ],
      activeBoard: null,

      // Actions
              createBoard: (title: string, description?: string) => {
          const newBoard: Board = {
            id: `board-${Date.now()}`,
            title,
            description,
            columnIds: [],
          };
        
        set((state) => ({
          boards: [...state.boards, newBoard],
        }));
        
        return newBoard.id;
      },

              updateBoard: (id: string, updates: Partial<Pick<Board, 'title' | 'description'>>) =>
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === id
                ? { ...board, ...updates }
                : board
            ),
          })),

      deleteBoard: (id: string) =>
        set((state) => ({
          boards: state.boards.filter(board => board.id !== id),
          activeBoard: state.activeBoard?.id === id ? null : state.activeBoard,
        })),

      setActiveBoard: (board: Board | null) =>
        set({ activeBoard: board }),

              addColumnToBoard: (boardId: string, columnId: string) =>
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId
                ? { 
                    ...board, 
                    columnIds: [...board.columnIds, columnId]
                  }
                : board
            ),
          })),

              removeColumnFromBoard: (boardId: string, columnId: string) =>
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId
                ? { 
                    ...board, 
                    columnIds: board.columnIds.filter(id => id !== columnId)
                  }
                : board
            ),
          })),
    }),
    { name: 'board-store' }
  )
);