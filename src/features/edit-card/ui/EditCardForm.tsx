import React, { useState } from 'react';
import { useCardStore, type Card } from '../../../entities/card';
import { Button } from '../../../shared/ui/Button';

interface EditCardFormProps {
  card: Card;
  onSave: () => void;
  onCancel: () => void;
}

export const EditCardForm: React.FC<EditCardFormProps> = ({ card, onSave, onCancel }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const { updateCard } = useCardStore();

  const handleSave = () => {
    updateCard(card.id, { title, description });
    onSave();
  };

  const handleCancel = () => {
    setTitle(card.title);
    setDescription(card.description || '');
    onCancel();
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Task title..."
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={3}
        placeholder="Task description..."
      />
      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm" variant="primary">
          Save
        </Button>
        <Button onClick={handleCancel} size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};