"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { Task, getPriorityColor, getPriorityBadgeColor } from "@/lib/kanban";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
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
            <div className="mt-1">
              <Badge 
                variant="secondary" 
                className={`text-xs ${getPriorityBadgeColor(task.priority)}`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
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
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {task.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}