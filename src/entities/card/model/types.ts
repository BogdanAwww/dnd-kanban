export type CardPriority = 'low' | 'medium' | 'high';

export interface Card {
  id: string;
  title: string;
  description?: string;
  priority: CardPriority;
  columnId: string;
  position: number;
}

export interface CardState {
  cards: Card[];
}

export const PRIORITY_CONFIGS: { priority: CardPriority; label: string; color: string }[] = [
  { priority: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { priority: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { priority: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
];