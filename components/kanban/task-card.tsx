"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, Calendar } from "lucide-react";
import { 
  Task, 
  getPriorityColor, 
  getPriorityBadgeColor,
  getDueDateBadgeColor,
  formatDueDate
} from "@/lib/kanban";
import { MarkdownViewer } from "./rich-text-editor";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  isFocused?: boolean;
  onSelect?: (isSelected: boolean) => void;
  onTaskClick?: (task: Task) => void;
}

export function TaskCard({ 
  task, 
  onDelete, 
  isSelected = false, 
  isFocused = false, 
  onSelect = () => {},
  onTaskClick = () => {}
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      onSelect(!isSelected);
    } else {
      e.preventDefault();
      e.stopPropagation();
      onTaskClick(task);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      data-task-id={task.id}
      onClick={handleClick}
      className={`cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-50" : ""
      } ${
        isSelected ? "ring-2 ring-blue-500 border-blue-500" : ""
      } ${
        isFocused ? "ring-2 ring-orange-400 border-orange-400" : ""
      } ${getPriorityColor(task.priority)}`}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight text-slate-900 dark:text-slate-100">
              {task.title}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge 
                variant="secondary" 
                className={`text-xs ${getPriorityBadgeColor(task.priority)}`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              {task.dueDate && (
                <Badge 
                  variant="outline"
                  className={`text-xs ${getDueDateBadgeColor(task)}`}
                >
                  <Calendar className="h-2.5 w-2.5 mr-1" />
                  {formatDueDate(new Date(task.dueDate))}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <GripVertical className="h-3 w-3 text-slate-400" />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="pt-0">
          <div className="text-xs">
            <MarkdownViewer 
              content={task.description} 
              maxHeight="120px"
              className="text-slate-600 dark:text-slate-400"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}