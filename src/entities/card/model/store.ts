import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Card, CardState, CardPriority } from './types';

interface CardStore extends CardState {
  // Actions
  createCard: (title: string, columnId: string, description?: string, priority?: CardPriority) => string;
  updateCard: (id: string, updates: Partial<Pick<Card, 'title' | 'description' | 'priority' | 'position'>>) => void;
  deleteCard: (id: string) => void;
  moveCard: (cardId: string, newColumnId: string, newPosition?: number) => void;
  moveMultipleCards: (cardIds: string[], newColumnId: string) => void;
  getCardsByColumn: (columnId: string) => Card[];
}

export const useCardStore = create<CardStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        cards: [
          {
            id: 'card-1',
            title: 'Design new landing page',
            description: 'Create wireframes and mockups for the new product landing page',
            priority: 'high',
            columnId: 'col-1',
            position: 0,
          },
          {
            id: 'card-2',
            title: 'Implement user authentication',
            description: 'Set up JWT-based authentication with login and signup flows',
            priority: 'medium',
            columnId: 'col-2',
            position: 0,
          },
          {
            id: 'card-3',
            title: 'Write API documentation',
            description: 'Document all REST endpoints with examples and response schemas',
            priority: 'low',
            columnId: 'col-3',
            position: 0,
          },
        ],

        // Actions
        createCard: (title: string, columnId: string, description?: string, priority: CardPriority = 'medium') => {
          const cards = get().cards;
          const columnCards = cards.filter(card => card.columnId === columnId);
          const newPosition = columnCards.length;
          
          const newCard: Card = {
            id: `card-${Date.now()}`,
            title,
            description,
            priority,
            columnId,
            position: newPosition,
          };
          
          set((state) => ({
            cards: [...state.cards, newCard],
          }));
          
          return newCard.id;
        },

        updateCard: (id: string, updates: Partial<Pick<Card, 'title' | 'description' | 'priority' | 'position'>>) =>
          set((state) => ({
            cards: state.cards.map((card) =>
              card.id === id
                ? { ...card, ...updates }
                : card
            ),
          })),

        deleteCard: (id: string) =>
          set((state) => ({
            cards: state.cards.filter(card => card.id !== id),
          })),

          moveCard: (cardId: string, newColumnId: string, newPosition?: number) => {
    const cards = get().cards;
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const targetColumnCards = cards.filter(c => c.columnId === newColumnId && c.id !== cardId);
    const finalPosition = newPosition ?? targetColumnCards.length;

    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId
          ? { ...c, columnId: newColumnId, position: finalPosition }
          : c
      ),
    }));
  },

  moveMultipleCards: (cardIds: string[], newColumnId: string) => {
    const cards = get().cards;
    const targetColumnCards = cards.filter(c => c.columnId === newColumnId && !cardIds.includes(c.id));
    let nextPosition = targetColumnCards.length;

    set((state) => ({
      cards: state.cards.map((c) => {
        if (cardIds.includes(c.id)) {
          const newPosition = nextPosition++;
          return { ...c, columnId: newColumnId, position: newPosition };
        }
        return c;
      }),
    }));
  },

        getCardsByColumn: (columnId: string) => {
          return get().cards
            .filter(card => card.columnId === columnId)
            .sort((a, b) => a.position - b.position);
        },
      }),
      {
        name: 'card-state',
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const parsed = JSON.parse(str);
            return {
              ...parsed,
              state: {
                ...parsed.state,
                cards: parsed.state.cards.map((card: any) => ({
                  ...card,
                  createdAt: new Date(card.createdAt),
                  updatedAt: new Date(card.updatedAt),
                })),
              },
            };
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
    { name: 'card-store' }
  )
);