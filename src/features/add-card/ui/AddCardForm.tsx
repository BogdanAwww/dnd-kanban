import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCardStore, type CardPriority, PRIORITY_CONFIGS } from '../../../entities/card';
import { useColumnStore } from '../../../entities/column';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

interface AddCardFormProps {
  boardId: string;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ boardId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CardPriority>('medium');
  const { createCard } = useCardStore();
  const { getColumnByStatus, addCardToColumn } = useColumnStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Find the "todo" column for this board
      const todoColumn = getColumnByStatus(boardId, 'todo');
      if (todoColumn) {
        const cardId = createCard(title.trim(), todoColumn.id, description.trim() || undefined, priority);
        addCardToColumn(todoColumn.id, cardId);
        setTitle('');
        setDescription('');
        setPriority('medium');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as CardPriority)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          {PRIORITY_CONFIGS.map((config) => (
            <option key={config.priority} value={config.priority}>
              {config.label} Priority
            </option>
          ))}
        </select>
      </div>
      <Input
        type="text"
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button 
        type="submit" 
        variant="primary"
        className="flex items-center gap-2"
        disabled={!title.trim()}
      >
        <Plus size={16} />
        Add Task
      </Button>
    </form>
  );
};