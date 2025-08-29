import React, { useState } from 'react';
import { X, Edit3, Trash2, Calendar, Tag, MessageSquare } from 'lucide-react';
import { type Card } from '../../../entities/card';
import { useCardStore } from '../../../entities/card';
import { useColumnStore } from '../../../entities/column';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { PriorityDropdown } from '../../change-priority';
import { MoveCardDropdown } from '../../move-card';

interface CardDetailSidebarProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailSidebar: React.FC<CardDetailSidebarProps> = ({
  card,
  isOpen,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  const { updateCard, deleteCard } = useCardStore();
  const { getColumnsByBoard } = useColumnStore();

  const currentColumn = getColumnsByBoard('board-1').find(col => col.id === card?.columnId);

  React.useEffect(() => {
    if (card) {
      setEditTitle(card.title);
      setEditDescription(card.description || '');
    }
  }, [card]);

  const handleSave = () => {
    if (card) {
      updateCard(card.id, {
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (card) {
      setEditTitle(card.title);
      setEditDescription(card.description || '');
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (card && confirm('Are you sure you want to delete this card?')) {
      deleteCard(card.id);
      onClose();
    }
  };

  if (!isOpen || !card) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Card Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Enter card title..."
                    className="w-full"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter card description..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{card.title}</h3>
                  {card.description && (
                    <p className="text-gray-600 whitespace-pre-wrap">{card.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Card Properties */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Properties</h4>
              
              {/* Priority */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Priority</span>
                </div>
                <PriorityDropdown card={card} />
              </div>

              {/* Column */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Column</span>
                </div>
                <div className="text-sm text-gray-900">{currentColumn?.title}</div>
              </div>

              {/* Move Card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Move to</span>
                </div>
                <MoveCardDropdown card={card} />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 size={16} />
                <span className="text-sm font-medium">Delete Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
