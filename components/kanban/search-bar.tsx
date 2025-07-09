"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/lib/kanban";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tasks: Task[];
  onFocus?: () => void;
  priorityFilter: Task['priority'] | 'all';
  statusFilter: Task['status'] | 'all';
  dueDateFilter: 'all' | 'overdue' | 'due-today' | 'due-week' | 'no-due-date';
  onPriorityFilterChange: (priority: Task['priority'] | 'all') => void;
  onStatusFilterChange: (status: Task['status'] | 'all') => void;
  onDueDateFilterChange: (dueDate: 'all' | 'overdue' | 'due-today' | 'due-week' | 'no-due-date') => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  tasks,
  onFocus,
  priorityFilter,
  statusFilter,
  dueDateFilter,
  onPriorityFilterChange,
  onStatusFilterChange,
  onDueDateFilterChange,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
        onSearchChange('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, onSearchChange]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const clearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onPriorityFilterChange('all');
    onStatusFilterChange('all');
    onDueDateFilterChange('all');
  };

  const hasFilters = searchQuery || priorityFilter !== 'all' || statusFilter !== 'all' || dueDateFilter !== 'all';
  const filteredCount = tasks.length;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          ref={inputRef}
          placeholder="Search tasks... (Press / to focus)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`pl-10 pr-10 transition-all duration-200 ${
            isFocused
              ? 'ring-2 ring-blue-500 border-blue-500'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Filters:</span>
        </div>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {/* Due Date Filter */}
        <Select value={dueDateFilter} onValueChange={onDueDateFilterChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Due Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Due Dates</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="due-today">Due Today</SelectItem>
            <SelectItem value="due-week">Due This Week</SelectItem>
            <SelectItem value="no-due-date">No Due Date</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-slate-600 dark:text-slate-400"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}

        {/* Results Count */}
        <div className="ml-auto">
          <Badge variant="secondary" className="text-xs">
            {filteredCount} {filteredCount === 1 ? 'task' : 'tasks'} found
          </Badge>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">Active filters:</span>
          
          {searchQuery && (
            <Badge variant="outline" className="text-xs">
              Search: &ldquo;{searchQuery}&rdquo;
            </Badge>
          )}
          
          {priorityFilter !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Priority: {priorityFilter}
            </Badge>
          )}
          
          {statusFilter !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Status: {statusFilter === 'in-progress' ? 'In Progress' : statusFilter === 'todo' ? 'To Do' : 'Done'}
            </Badge>
          )}
          
          {dueDateFilter !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Due Date: {dueDateFilter === 'due-today' ? 'Due Today' : 
                       dueDateFilter === 'due-week' ? 'Due This Week' : 
                       dueDateFilter === 'overdue' ? 'Overdue' : 
                       'No Due Date'}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}