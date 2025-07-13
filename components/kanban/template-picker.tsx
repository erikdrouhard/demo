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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Zap, 
  Search,
  Clock,
  Tag
} from "lucide-react";
import { 
  TASK_TEMPLATES, 
  TaskTemplate, 
  getTemplatesByCategory, 
  applyTemplate,
  getQuickActions
} from "@/lib/task-templates";
import { Task } from "@/lib/kanban";

interface TemplatePickerProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  defaultStatus: Task['status'];
  children: React.ReactNode;
}

export function TemplatePicker({ 
  onCreateTask, 
  defaultStatus, 
  children 
}: TemplatePickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const templatesByCategory = getTemplatesByCategory();
  const quickActions = getQuickActions();

  const filteredTemplates = searchQuery
    ? TASK_TEMPLATES.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TASK_TEMPLATES;

  const handleTemplateSelect = (template: TaskTemplate) => {
    const taskData = applyTemplate(template);
    onCreateTask({
      ...taskData,
      status: defaultStatus,
    } as Omit<Task, 'id' | 'createdAt'>);
    setOpen(false);
  };

  const handleQuickAction = (action: () => Partial<Task>) => {
    const taskData = action();
    onCreateTask({
      ...taskData,
      status: defaultStatus,
    } as Omit<Task, 'id' | 'createdAt'>);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Task Templates & Quick Actions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="quick-actions" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quick-actions" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Actions
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Results
              </TabsTrigger>
            </TabsList>

            {/* Quick Actions Tab */}
            <TabsContent value="quick-actions" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <span className="text-lg" role="img" aria-label={action.name}>
                          {action.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{action.name}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-6">
                  {Object.entries(templatesByCategory).map(([category, templates]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {templates.map((template) => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            onSelect={() => handleTemplateSelect(template)}
                          />
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Search Results Tab */}
            <TabsContent value="search" className="mt-4">
              <ScrollArea className="h-[400px]">
                {searchQuery ? (
                  <div className="space-y-3">
                    {filteredTemplates.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredTemplates.map((template) => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            onSelect={() => handleTemplateSelect(template)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        No templates found matching &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Enter a search term to find templates
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TemplateCardProps {
  template: TaskTemplate;
  onSelect: () => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Button
      variant="outline"
      className="h-auto p-4 text-left justify-start hover:bg-slate-50 dark:hover:bg-slate-800"
      onClick={onSelect}
    >
      <div className="flex items-start gap-3 w-full">
        <span className="text-lg" role="img" aria-label={template.name}>
          {template.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{template.name}</div>
          <div className="text-xs text-slate-500 mt-1 line-clamp-2">
            {template.description}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="secondary" 
              className="text-xs"
            >
              {template.category}
            </Badge>
            {template.estimatedDays && (
              <Badge 
                variant="outline" 
                className="text-xs flex items-center gap-1"
              >
                <Clock className="h-2.5 w-2.5" />
                {template.estimatedDays}d
              </Badge>
            )}
            {template.tags && template.tags.length > 0 && (
              <Badge 
                variant="outline" 
                className="text-xs flex items-center gap-1"
              >
                <Tag className="h-2.5 w-2.5" />
                {template.tags.length}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Button>
  );
}