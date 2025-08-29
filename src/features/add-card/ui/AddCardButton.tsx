import React, { useState } from 'react';
import { useCardStore } from '../../../entities/card';
import { useColumnStore } from '../../../entities/column';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

interface AddCardButtonProps {
  columnId: string;
}

export const AddCardButton: React.FC<AddCardButtonProps> = ({ columnId }) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { createCard } = useCardStore();
  const { addCardToColumn } = useColumnStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cardId = createCard(title.trim(), columnId);
    addCardToColumn(columnId, cardId);
    
    setTitle('');
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent"
        variant='outline'
      >
        + Add Card
      </Button>
    );
  }

  return (
    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter card title..."
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 disabled:opacity-50"
          >
            Add
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
