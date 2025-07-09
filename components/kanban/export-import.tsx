"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  FileCode,
  Copy,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Task } from "@/lib/kanban";

interface ExportImportProps {
  tasks: Task[];
  onImportTasks: (tasks: Task[]) => void;
  children: React.ReactNode;
}

export function ExportImport({ tasks, onImportTasks, children }: ExportImportProps) {
  const [open, setOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      tasks: tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
      }))
    };
    return JSON.stringify(data, null, 2);
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Title', 
      'Description',
      'Status',
      'Priority',
      'Created At',
      'Due Date',
      'Tags'
    ];
    
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        task.id,
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.status,
        task.priority,
        task.createdAt.toISOString(),
        task.dueDate ? task.dueDate.toISOString() : '',
        `"${(task.tags || []).join(', ')}"`,
      ].join(','))
    ].join('\n');
    
    return csvContent;
  };

  const exportToMarkdown = () => {
    const statusEmojis = {
      'todo': '⏳',
      'in-progress': '🔄',
      'done': '✅'
    };

    const priorityEmojis = {
      'high': '🔴',
      'medium': '🟡', 
      'low': '🟢'
    };

    let markdown = `# Task Export\n\n`;
    markdown += `**Export Date:** ${new Date().toLocaleDateString()}\n`;
    markdown += `**Total Tasks:** ${tasks.length}\n\n`;

    const tasksByStatus = {
      'todo': tasks.filter(t => t.status === 'todo'),
      'in-progress': tasks.filter(t => t.status === 'in-progress'),
      'done': tasks.filter(t => t.status === 'done'),
    };

    Object.entries(tasksByStatus).forEach(([status, statusTasks]) => {
      if (statusTasks.length === 0) return;
      
      const statusTitle = status === 'in-progress' ? 'In Progress' : 
                         status.charAt(0).toUpperCase() + status.slice(1);
      
      markdown += `## ${statusEmojis[status as keyof typeof statusEmojis]} ${statusTitle} (${statusTasks.length})\n\n`;
      
      statusTasks.forEach(task => {
        markdown += `### ${priorityEmojis[task.priority]} ${task.title}\n\n`;
        
        if (task.description) {
          markdown += `${task.description}\n\n`;
        }
        
        markdown += `**Details:**\n`;
        markdown += `- Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}\n`;
        markdown += `- Created: ${task.createdAt.toLocaleDateString()}\n`;
        
        if (task.dueDate) {
          markdown += `- Due: ${task.dueDate.toLocaleDateString()}\n`;
        }
        
        if (task.tags && task.tags.length > 0) {
          markdown += `- Tags: ${task.tags.map(tag => `\`${tag}\``).join(', ')}\n`;
        }
        
        markdown += '\n---\n\n';
      });
    });

    return markdown;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleImport = () => {
    try {
      setImportError("");
      const data = JSON.parse(importData);
      
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error("Invalid format: 'tasks' array is required");
      }

      const importedTasks: Task[] = data.tasks.map((task: Record<string, unknown>) => ({
        ...task,
        createdAt: new Date(task.createdAt as string),
        dueDate: task.dueDate ? new Date(task.dueDate as string) : undefined,
      }));

      // Validate each task has required fields
      for (const task of importedTasks) {
        if (!task.id || !task.title || !task.status || !task.priority) {
          throw new Error("Invalid task format: missing required fields");
        }
      }

      onImportTasks(importedTasks);
      setImportData("");
      setOpen(false);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Invalid JSON format");
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const jsonFilename = `kanban-tasks-${today}.json`;
  const csvFilename = `kanban-tasks-${today}.csv`;
  const markdownFilename = `kanban-tasks-${today}.md`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Import Tasks
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export" className="mt-4 space-y-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Export your {tasks.length} tasks in various formats for backup or sharing.
            </div>

            <div className="space-y-4">
              {/* JSON Export */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span className="font-medium">JSON Format</span>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Complete data with all task properties. Best for reimporting.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => downloadFile(exportToJSON(), jsonFilename, 'application/json')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(exportToJSON(), 'json')}
                  >
                    {copied === 'json' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    {copied === 'json' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* CSV Export */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="font-medium">CSV Format</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Spreadsheet format for analysis in Excel, Google Sheets, etc.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => downloadFile(exportToCSV(), csvFilename, 'text/csv')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(exportToCSV(), 'csv')}
                  >
                    {copied === 'csv' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    {copied === 'csv' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Markdown Export */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Markdown Format</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Human-readable format for documentation and sharing.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => downloadFile(exportToMarkdown(), markdownFilename, 'text/markdown')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(exportToMarkdown(), 'markdown')}
                  >
                    {copied === 'markdown' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    {copied === 'markdown' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Import Tab */}
          <TabsContent value="import" className="mt-4 space-y-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Import tasks from a JSON export. This will merge with existing tasks.
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Paste JSON Data
                </label>
                <Textarea
                  placeholder="Paste your exported JSON data here..."
                  value={importData}
                  onChange={(e) => {
                    setImportData(e.target.value);
                    setImportError("");
                  }}
                  rows={10}
                  className="font-mono text-xs"
                />
              </div>

              {importError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Import Error</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleImport}
                  disabled={!importData.trim()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Tasks
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setImportData("");
                    setImportError("");
                  }}
                  disabled={!importData.trim()}
                >
                  Clear
                </Button>
              </div>

              <Separator />

              <div className="text-xs text-slate-500 space-y-1">
                <p><strong>Note:</strong> Import expects JSON format from this app&apos;s export feature.</p>
                <p>Imported tasks will be merged with existing tasks. Duplicate IDs will be skipped.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}