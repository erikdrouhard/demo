# Kanban Board Module

## Overview
This module provides a complete drag-and-drop Kanban board implementation for task management with priority-based visual organization.

## Architecture

### Core Components
- **KanbanBoard** (`/components/kanban/kanban-board.tsx`) - Main container with drag-drop logic and state management
- **KanbanColumn** (`/components/kanban/kanban-column.tsx`) - Individual column component with droppable zones
- **TaskCard** (`/components/kanban/task-card.tsx`) - Draggable task cards with priority-based styling
- **AddTaskDialog** (`/components/kanban/add-task-dialog.tsx`) - Modal for creating new tasks

### Data Layer
- **Types & Utilities** (`/lib/kanban.ts`) - Task interface, column definitions, persistence, and styling utilities
- **Local Storage** - Automatic persistence of board state with backward compatibility

## Features

### Task Management
- **CRUD Operations**: Create, read, update (via drag-drop), delete tasks
- **Priority System**: High (red), Medium (yellow), Low (green) with visual color coding
- **Status Tracking**: Todo, In Progress, Done columns
- **Rich Content**: Title, description, priority, timestamps

### Drag & Drop
- **Library**: @dnd-kit for accessible, performant drag-and-drop
- **Cross-Column Movement**: Tasks can be moved between any columns
- **Reordering**: Tasks can be reordered within columns
- **Visual Feedback**: Drag overlay and opacity changes during drag operations

### UI/UX
- **Responsive Design**: Mobile-first approach with grid layout
- **Dark Mode**: Full support for light/dark themes
- **Priority Colors**: Subtle background colors and matching badges
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Development Guidelines

### Adding New Features
1. **State Management**: All state changes should go through the main KanbanBoard component
2. **Persistence**: Use the `saveTasks`/`loadTasks` utilities for localStorage operations
3. **Styling**: Follow the established priority color system and Tailwind patterns
4. **Types**: Update the Task interface in `/lib/kanban.ts` for any new fields

### Priority System
- **High Priority**: Red styling (`border-red-200`, `bg-red-50`, etc.)
- **Medium Priority**: Yellow styling (`border-yellow-200`, `bg-yellow-50`, etc.)
- **Low Priority**: Green styling (`border-green-200`, `bg-green-50`, etc.)
- **Color Functions**: Use `getPriorityColor()` and `getPriorityBadgeColor()` utilities

### Drag & Drop Implementation
- **Sensors**: PointerSensor with 8px activation distance to prevent accidental drags
- **Strategies**: verticalListSortingStrategy for column sorting
- **Event Handling**: Separate handlers for dragStart, dragOver, and dragEnd
- **Performance**: Uses React.memo and proper dependency arrays

### Data Persistence
- **Storage Key**: `kanban-tasks` in localStorage
- **Migration**: Automatic default values for new fields (e.g., priority defaults to 'medium')
- **Error Handling**: Graceful fallback to empty array on parse errors
- **SSR Compatibility**: Proper window checks for server-side rendering

### Component Structure
```
KanbanBoard (state management, drag context)
   KanbanColumn (droppable zones)
      TaskCard (draggable items)
      AddTaskDialog (task creation)
   DragOverlay (drag preview)
```

### Styling Patterns
- **Consistency**: Use slate color theme throughout
- **Spacing**: Consistent gap-* and space-y-* patterns
- **Cards**: Subtle shadows and borders with hover states
- **Typography**: Geist font family with proper sizing hierarchy

## Common Tasks

### Adding a New Task Field
1. Update `Task` interface in `/lib/kanban.ts`
2. Modify `AddTaskDialog` to include the new field
3. Update `TaskCard` to display the field
4. Add migration logic in `loadTasks()` if needed

### Customizing Priority Colors
- Modify `getPriorityColor()` and `getPriorityBadgeColor()` functions
- Ensure both light and dark mode variants are included
- Test with all priority levels

### Adding New Columns
- Update `COLUMNS` array in `/lib/kanban.ts`
- Ensure status type includes new column ID
- Test drag-drop functionality with new columns

## Performance Considerations
- **Drag Operations**: Minimal re-renders during drag with proper event handling
- **Storage**: Debounced saves to localStorage (every state change)
- **Components**: React.memo where appropriate to prevent unnecessary re-renders
- **Bundle Size**: Tree-shaking friendly imports from @dnd-kit

## Testing Strategy
- **Manual Testing**: Verify drag-drop across all columns and priority levels
- **Edge Cases**: Empty columns, long task titles, mobile interactions
- **Persistence**: Verify localStorage save/load functionality
- **Accessibility**: Keyboard navigation and screen reader compatibility

## Dependencies
- **@dnd-kit/core**: Core drag-and-drop functionality
- **@dnd-kit/sortable**: Sortable list implementation
- **@dnd-kit/utilities**: Utility functions for drag operations
- **Shadcn/ui**: Card, Button, Dialog, Input, Textarea, Select, Badge components