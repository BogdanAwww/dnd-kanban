import React, { useState } from 'react';
import { useColumnStore } from '../../../entities/column';
import { useBoardStore } from '../../../entities/board';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

interface AddColumnFormProps {
  boardId: string;
}

export const AddColumnForm: React.FC<AddColumnFormProps> = ({ boardId }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { createColumn } = useColumnStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createColumn(title.trim(), status, boardId);
    
    setTitle('');
    setStatus('todo');
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setStatus('todo');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="w-full h-12 border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 bg-transparent"
        variant='outline'
      >
        + Add Column
      </Button>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="column-title" className="block text-sm font-medium text-gray-700 mb-1">
            Column Title
          </label>
          <Input
            id="column-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter column title..."
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="column-status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="column-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'todo' | 'in-progress' | 'done')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          >
            Add Column
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
