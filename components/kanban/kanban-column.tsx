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
import { Task, Column } from "@/lib/kanban";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
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
              />
            ))}
          </SortableContext>
        </div>
        <div className="mt-4">
          <AddTaskDialog onAddTask={onAddTask} status={column.status} />
        </div>
      </CardContent>
    </Card>
  );
}