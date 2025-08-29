import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useCardStore } from '../../../entities/card';
import { useColumnStore } from '../../../entities/column';

interface CardSearchProps {
  boardId: string;
  onSearchResults: (cardIds: Set<string>) => void;
}

export const CardSearch: React.FC<CardSearchProps> = ({ boardId, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { getCardsByColumn } = useCardStore();
  const { getColumnsByBoard } = useColumnStore();

  const columns = getColumnsByBoard(boardId);

  useEffect(() => {
    if (!searchQuery.trim()) {
      onSearchResults(new Set());
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const matchingCardIds = new Set<string>();

    columns.forEach(column => {
      const cards = getCardsByColumn(column.id);
      cards.forEach(card => {
        if (card.title.toLowerCase().includes(query) || 
            (card.description && card.description.toLowerCase().includes(query))) {
          matchingCardIds.add(card.id);
        }
      });
    });

    onSearchResults(matchingCardIds);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="relative">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
                      <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="Search cards..."
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64 transition-all duration-200"
            />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
          <div className="p-3 text-sm text-gray-600">
            {(() => {
              const query = searchQuery.toLowerCase().trim();
              const results: Array<{ card: any; column: any }> = [];
              
              columns.forEach(column => {
                const cards = getCardsByColumn(column.id);
                cards.forEach(card => {
                  if (card.title.toLowerCase().includes(query) || 
                      (card.description && card.description.toLowerCase().includes(query))) {
                    results.push({ card, column });
                  }
                });
              });
              
              if (results.length === 0) {
                return <div className="text-gray-500">No cards found</div>;
              }
              
              return (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {results.length} card{results.length !== 1 ? 's' : ''} found
                  </div>
                  {results.slice(0, 5).map(({ card, column }) => (
                    <div key={card.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="font-medium text-gray-900">{card.title}</div>
                      <div className="text-xs text-gray-500">in {column.title}</div>
                    </div>
                  ))}
                  {results.length > 5 && (
                    <div className="text-xs text-gray-500 pt-1 border-t">
                      +{results.length - 5} more results
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
