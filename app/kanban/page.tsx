"use client";

import { KanbanBoard } from "@/components/kanban/kanban-board";

export default function KanbanPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-[family-name:var(--font-geist-sans)]">
            Kanban Board
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Organize your tasks with drag and drop functionality
          </p>
        </div>
        <KanbanBoard />
      </div>
    </div>
  );
}