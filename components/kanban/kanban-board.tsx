"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { SearchBar } from "./search-bar";
import { ShortcutsOverlay } from "./shortcuts-overlay";
import { AddTaskDialog } from "./add-task-dialog";
import { TaskDetailModal } from "./task-detail-modal";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { ExportImport } from "./export-import";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowRight, BarChart3, Download } from "lucide-react";
import {
  Task,
  COLUMNS,
  generateId,
  saveTasks,
  loadTasks,
  getTasksByStatus,
  searchTasks,
  moveTasksToStatus,
  deleteTasksById,
  getNextTaskId,
  getPreviousTaskId,
  getFirstTaskId,
  isOverdue,
  isDueSoon,
} from "@/lib/kanban";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'due-today' | 'due-week' | 'no-due-date'>('all');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    setShowBulkActions(selectedTaskIds.size > 0);
  }, [selectedTaskIds]);

  const getFilteredTasks = useCallback(() => {
    let filtered = tasks;
    
    // Apply search filter
    if (searchQuery) {
      filtered = searchTasks(filtered, searchQuery);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    // Apply due date filter
    if (dueDateFilter !== 'all') {
      if (dueDateFilter === 'overdue') {
        filtered = filtered.filter(task => isOverdue(task));
      } else if (dueDateFilter === 'due-today') {
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const today = new Date();
          const taskDue = new Date(task.dueDate);
          return taskDue.toDateString() === today.toDateString();
        });
      } else if (dueDateFilter === 'due-week') {
        filtered = filtered.filter(task => isDueSoon(task, 7));
      } else if (dueDateFilter === 'no-due-date') {
        filtered = filtered.filter(task => !task.dueDate);
      }
    }
    
    return filtered;
  }, [tasks, searchQuery, priorityFilter, statusFilter, dueDateFilter]);

  const handleTaskSelect = (taskId: string, isSelected: boolean) => {
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const filteredTasks = getFilteredTasks();
    setSelectedTaskIds(new Set(filteredTasks.map(task => task.id)));
  };

  const handleDeselectAll = () => {
    setSelectedTaskIds(new Set());
  };

  const handleBulkDelete = () => {
    setTasks(prev => deleteTasksById(prev, Array.from(selectedTaskIds)));
    setSelectedTaskIds(new Set());
    setShowBulkActions(false);
  };

  const handleBulkMove = (status: Task['status']) => {
    setTasks(prev => moveTasksToStatus(prev, Array.from(selectedTaskIds), status));
    setSelectedTaskIds(new Set());
    setShowBulkActions(false);
  };

  const navigateToTask = (direction: 'next' | 'prev' | 'first' | 'last') => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) return;
    
    let nextTaskId: string | null = null;
    
    if (direction === 'first') {
      nextTaskId = getFirstTaskId(filteredTasks);
    } else if (direction === 'last') {
      nextTaskId = filteredTasks[filteredTasks.length - 1]?.id || null;
    } else if (focusedTaskId) {
      if (direction === 'next') {
        nextTaskId = getNextTaskId(filteredTasks, focusedTaskId);
      } else {
        nextTaskId = getPreviousTaskId(filteredTasks, focusedTaskId);
      }
    } else {
      nextTaskId = getFirstTaskId(filteredTasks);
    }
    
    if (nextTaskId) {
      setFocusedTaskId(nextTaskId);
      // Scroll the focused task into view
      setTimeout(() => {
        const taskElement = document.querySelector(`[data-task-id="${nextTaskId}"]`);
        taskElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  };

  const shortcuts = useKeyboardShortcuts({
    shortcuts: [
      // Navigation
      {
        key: 'j',
        action: () => navigateToTask('next'),
        description: 'Navigate to next task',
        category: 'Navigation',
      },
      {
        key: 'k',
        action: () => navigateToTask('prev'),
        description: 'Navigate to previous task',
        category: 'Navigation',
      },
      {
        key: 'g',
        action: () => navigateToTask('first'),
        description: 'Go to first task',
        category: 'Navigation',
      },
      {
        key: 'G',
        shiftKey: true,
        action: () => navigateToTask('last'),
        description: 'Go to last task',
        category: 'Navigation',
      },
      // Task Actions
      {
        key: 'n',
        action: () => setIsQuickCreateOpen(true),
        description: 'Create new task',
        category: 'Task Actions',
      },
      {
        key: 'c',
        action: () => setIsQuickCreateOpen(true),
        description: 'Create new task',
        category: 'Task Actions',
      },
      {
        key: 'x',
        action: () => {
          if (focusedTaskId) {
            const isSelected = selectedTaskIds.has(focusedTaskId);
            handleTaskSelect(focusedTaskId, !isSelected);
          }
        },
        description: 'Toggle task selection',
        category: 'Task Actions',
      },
      {
        key: 'Delete',
        action: () => {
          if (selectedTaskIds.size > 0) {
            handleBulkDelete();
          } else if (focusedTaskId) {
            handleDeleteTask(focusedTaskId);
          }
        },
        description: 'Delete selected tasks or focused task',
        category: 'Task Actions',
      },
      // Bulk Actions
      {
        key: 'a',
        ctrlKey: true,
        action: handleSelectAll,
        description: 'Select all visible tasks',
        category: 'Bulk Actions',
      },
      {
        key: 'a',
        metaKey: true,
        action: handleSelectAll,
        description: 'Select all visible tasks',
        category: 'Bulk Actions',
      },
      {
        key: 'Escape',
        action: handleDeselectAll,
        description: 'Deselect all tasks',
        category: 'Bulk Actions',
      },
      // Status Changes
      {
        key: '1',
        action: () => {
          if (selectedTaskIds.size > 0) {
            handleBulkMove('todo');
          } else if (focusedTaskId) {
            handleBulkMove('todo');
            setSelectedTaskIds(new Set([focusedTaskId]));
          }
        },
        description: 'Move to To Do',
        category: 'Status Changes',
      },
      {
        key: '2',
        action: () => {
          if (selectedTaskIds.size > 0) {
            handleBulkMove('in-progress');
          } else if (focusedTaskId) {
            setSelectedTaskIds(new Set([focusedTaskId]));
            handleBulkMove('in-progress');
          }
        },
        description: 'Move to In Progress',
        category: 'Status Changes',
      },
      {
        key: '3',
        action: () => {
          if (selectedTaskIds.size > 0) {
            handleBulkMove('done');
          } else if (focusedTaskId) {
            setSelectedTaskIds(new Set([focusedTaskId]));
            handleBulkMove('done');
          }
        },
        description: 'Move to Done',
        category: 'Status Changes',
      },
      // Help
      {
        key: '?',
        action: () => {
          // This will be handled by the ShortcutsOverlay component
        },
        description: 'Show keyboard shortcuts',
        category: 'Help',
      },
    ],
    enabled: !isQuickCreateOpen,
  });

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: generateId(),
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, task]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    if (focusedTaskId === id) {
      setFocusedTaskId(null);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleImportTasks = (importedTasks: Task[]) => {
    const existingIds = new Set(tasks.map(t => t.id));
    const newTasks = importedTasks.filter(t => !existingIds.has(t.id));
    
    if (newTasks.length > 0) {
      setTasks(prev => [...prev, ...newTasks]);
    }
  };


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // Dropping over a column
    if (COLUMNS.some((col) => col.id === overId)) {
      const newStatus = overId as Task['status'];
      if (activeTask.status !== newStatus) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === activeId ? { ...task, status: newStatus } : task
          )
        );
      }
      return;
    }

    // Dropping over another task
    if (overTask && activeTask.status !== overTask.status) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: overTask.status } : task
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    // If dropping over a task in the same column, reorder
    if (overTask && activeTask.status === overTask.status) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      setTasks((prev) => arrayMove(prev, activeIndex, overIndex));
    }

    setActiveTask(null);
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div ref={boardRef} className="space-y-6">
      {/* Header with Analytics */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            tasks={filteredTasks}
            priorityFilter={priorityFilter}
            statusFilter={statusFilter}
            dueDateFilter={dueDateFilter}
            onPriorityFilterChange={setPriorityFilter}
            onStatusFilterChange={setStatusFilter}
            onDueDateFilterChange={setDueDateFilter}
          />
        </div>
        <div className="ml-4 flex gap-2">
          <AnalyticsDashboard tasks={tasks}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </AnalyticsDashboard>
          <ExportImport tasks={tasks} onImportTasks={handleImportTasks}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </ExportImport>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedTaskIds.size} {selectedTaskIds.size === 1 ? 'task' : 'tasks'} selected
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkMove('todo')}
              className="text-slate-600"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              To Do
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkMove('in-progress')}
              className="text-blue-600"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              In Progress
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkMove('done')}
              className="text-green-600"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              Done
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeselectAll}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(filteredTasks, column.status);
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                selectedTaskIds={selectedTaskIds}
                focusedTaskId={focusedTaskId}
                onTaskSelect={handleTaskSelect}
                onTaskClick={handleTaskClick}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard 
              task={activeTask} 
              onDelete={() => {}} 
              isSelected={false}
              isFocused={false}
              onSelect={() => {}}
              onTaskClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Quick Create Dialog */}
      <AddTaskDialog
        onAddTask={handleAddTask}
        status="todo"
        open={isQuickCreateOpen}
        onOpenChange={setIsQuickCreateOpen}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        open={isTaskDetailOpen}
        onOpenChange={setIsTaskDetailOpen}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Keyboard Shortcuts Overlay */}
      <ShortcutsOverlay shortcuts={shortcuts.shortcuts} />
    </div>
  );
}