import { create } from 'zustand';

interface SelectionState {
  selectedCards: Set<string>;
  isSelectMode: boolean;
}

interface SelectionActions {
  toggleCard: (cardId: string) => void;
  selectCard: (cardId: string) => void;
  deselectCard: (cardId: string) => void;
  selectAll: (cardIds: string[]) => void;
  deselectAll: () => void;
  toggleSelectMode: () => void;
  clearSelection: () => void;
}

type SelectionStore = SelectionState & SelectionActions;

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectedCards: new Set(),
  isSelectMode: false,

  toggleCard: (cardId: string) => {
    set((state) => {
      const newSelected = new Set(state.selectedCards);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return {
        selectedCards: newSelected,
        isSelectMode: newSelected.size > 0,
      };
    });
  },

  selectCard: (cardId: string) => {
    set((state) => {
      const newSelected = new Set(state.selectedCards);
      newSelected.add(cardId);
      return {
        selectedCards: newSelected,
        isSelectMode: true,
      };
    });
  },

  deselectCard: (cardId: string) => {
    set((state) => {
      const newSelected = new Set(state.selectedCards);
      newSelected.delete(cardId);
      return {
        selectedCards: newSelected,
        isSelectMode: newSelected.size > 0,
      };
    });
  },

  selectAll: (cardIds: string[]) => {
    set({
      selectedCards: new Set(cardIds),
      isSelectMode: true,
    });
  },

  deselectAll: () => {
    set({
      selectedCards: new Set(),
      isSelectMode: false,
    });
  },

  toggleSelectMode: () => {
    set((state) => ({
      isSelectMode: !state.isSelectMode,
      selectedCards: new Set(),
    }));
  },

  clearSelection: () => {
    set({
      selectedCards: new Set(),
      isSelectMode: false,
    });
  },
}));
