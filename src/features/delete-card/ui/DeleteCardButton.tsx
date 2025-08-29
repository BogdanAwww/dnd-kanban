import React from 'react';
import { Trash2 } from 'lucide-react';
import { useCardStore, type Card } from '../../../entities/card';

interface DeleteCardButtonProps {
  card: Card;
}

export const DeleteCardButton: React.FC<DeleteCardButtonProps> = ({ card }) => {
  const { deleteCard } = useCardStore();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteCard(card.id);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-600 transition-colors p-1"
      title="Delete card"
    >
      <Trash2 size={16} />
    </button>
  );
};