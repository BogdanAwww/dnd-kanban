**[Demo](https://bogdanawww.github.io/dnd-kanban/)**


# Kanban Board - React TypeScript Project

A modern, feature-rich Kanban board application built with React, TypeScript, and Tailwind CSS, following a simplified Feature-Sliced Design (FSD) architecture.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with strict typing
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Zustand** - Lightweight state management with persistence
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons

## 🏗️ Architecture

This project follows a **simplified Feature-Sliced Design (FSD)** structure, adapted for frontend-heavy business logic:

```
src/
├── app/                    # Application layer
│   ├── App.tsx            # Root component
│   ├── providers/         # Global providers (Store, etc.)
│   └── ui/               # App-level UI components
├── entities/              # Business entities
│   ├── board/            # Board entity (data + store)
│   ├── card/             # Card entity (data + store)
│   └── column/           # Column entity (data + store)
├── features/              # Business features
│   ├── add-card/         # Add card functionality
│   ├── add-column/       # Add column functionality
│   ├── bulk-operations/  # Multi-select and bulk actions
│   ├── card-detail/      # Card detail sidebar
│   ├── card-search/      # Search functionality
│   ├── change-priority/  # Priority management
│   ├── column-filter/    # Column visibility filter
│   ├── delete-card/      # Card deletion
│   ├── edit-card/        # Card editing
│   ├── move-card/        # Card movement between columns
│   └── view-board/       # Main board view
└── shared/               # Shared utilities and components
    ├── config/           # Configuration files
    ├── lib/              # Shared libraries (DnD, selection, etc.)
    ├── types/            # Shared TypeScript types
    └── ui/               # Shared UI components
```

## ✨ Features

### 🎯 Core Functionality
- **Kanban Board** - Drag and drop task management
- **Multiple Columns** - Create, edit, and delete columns
- **Card Management** - Create, edit, delete, and move cards
- **Priority System** - Set card priorities (High, Medium, Low)
- **Real-time Search** - Search cards by title and description
- **Column Filtering** - Show/hide specific columns

### 🎨 User Experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Drag & Drop** - Intuitive card and column reordering
- **Multi-select** - Select multiple cards for bulk operations
- **Card Details Sidebar** - Notion-style detailed card view
- **Adaptive Layout** - Smart responsive header and controls

### 🔧 Advanced Features
- **Bulk Operations** - Delete, move, and update multiple cards
- **State Persistence** - Data persists across browser sessions
- **Search Highlighting** - Visual feedback for search results
- **Column Management** - Add, delete, and reorder columns
- **Selection Mode** - Toggle between normal and selection modes

## 🛠️ Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd kanban-board

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure Details

### Entities Layer
Contains core business entities with their data models and state management:

- **Board** - Board management with Zustand store
- **Card** - Card entity with CRUD operations and persistence
- **Column** - Column management with drag & drop support

### Features Layer
Business features organized by functionality:

- **add-card** - Card creation with inline forms
- **add-column** - Column creation with status selection
- **bulk-operations** - Multi-select and bulk actions
- **card-detail** - Detailed card view sidebar
- **card-search** - Real-time search with highlighting
- **change-priority** - Priority management dropdown
- **column-filter** - Column visibility controls
- **delete-card** - Card deletion with confirmation
- **edit-card** - Inline card editing
- **move-card** - Cross-column card movement
- **view-board** - Main board view with all features

### Shared Layer
Reusable utilities and components:

- **config** - Application configuration
- **lib** - Shared libraries (DnD, selection management)
- **types** - Common TypeScript interfaces
- **ui** - Reusable UI components (Button, Input, etc.)

## 🎯 Key Design Decisions

### Simplified FSD
- **Frontend-heavy logic** - Adapted FSD for complex UI interactions
- **Feature-based organization** - Each feature is self-contained
- **Shared utilities** - Common functionality in shared layer
- **Entity separation** - Clear separation of data and business logic

### State Management
- **Zustand** - Lightweight alternative to Redux
- **Persistence** - Automatic state persistence to localStorage
- **Reactive updates** - Components automatically re-render on state changes
- **Type safety** - Full TypeScript support for state

### UI/UX Design
- **Tailwind CSS** - Rapid development with utility classes
- **Responsive design** - Mobile-first approach
- **Accessibility** - Keyboard navigation and screen reader support
- **Modern interactions** - Drag & drop, multi-select, real-time search

## 🔄 Development Workflow

1. **Feature Development** - Add new features in the `features/` directory
2. **Entity Updates** - Modify entities in the `entities/` directory
3. **Shared Components** - Create reusable components in `shared/ui/`
4. **Type Safety** - Define types in `shared/types/` or entity-specific type files

## 🚀 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Real-time collaboration
- [ ] Advanced filtering and sorting
- [ ] Card templates and bulk import
- [ ] Board templates and themes
- [ ] Export/import functionality
- [ ] Keyboard shortcuts
- [ ] Dark mode support
