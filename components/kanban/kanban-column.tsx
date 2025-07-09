"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";
import { AddTaskDialog } from "./add-task-dialog";
import { TemplatePicker } from "./template-picker";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Task, Column } from "@/lib/kanban";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (id: string) => void;
  selectedTaskIds?: Set<string>;
  focusedTaskId?: string | null;
  onTaskSelect?: (taskId: string, isSelected: boolean) => void;
  onTaskClick?: (task: Task) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  selectedTaskIds = new Set(),
  focusedTaskId = null,
  onTaskSelect = () => {},
  onTaskClick = () => {},
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <Card className="flex flex-col h-fit min-h-[400px] bg-slate-50/50 dark:bg-slate-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {column.title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <div
          ref={setNodeRef}
          className="space-y-3 min-h-[300px]"
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                isSelected={selectedTaskIds.has(task.id)}
                isFocused={focusedTaskId === task.id}
                onSelect={(isSelected: boolean) => onTaskSelect(task.id, isSelected)}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </div>
        <div className="mt-4 space-y-2">
          <AddTaskDialog onAddTask={onAddTask} status={column.status} />
          <TemplatePicker onCreateTask={onAddTask} defaultStatus={column.status}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <FileText className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </TemplatePicker>
        </div>
      </CardContent>
    </Card>
  );
}