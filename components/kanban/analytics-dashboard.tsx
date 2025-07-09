"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import { Task, isOverdue, isDueSoon } from "@/lib/kanban";

interface AnalyticsDashboardProps {
  tasks: Task[];
  children: React.ReactNode;
}

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  dueSoon: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  completionRate: number;
  avgCompletionTime: number;
}

export function AnalyticsDashboard({ tasks, children }: AnalyticsDashboardProps) {
  const [open, setOpen] = useState(false);

  const stats = useMemo((): TaskStats => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const overdue = tasks.filter(isOverdue).length;
    const dueSoon = tasks.filter(t => isDueSoon(t, 3)).length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Calculate average completion time for completed tasks
    const completedTasks = tasks.filter(t => t.status === 'done');
    let avgCompletionTime = 0;
    if (completedTasks.length > 0) {
      const totalDays = completedTasks.reduce((sum, task) => {
        const created = new Date(task.createdAt);
        const now = new Date();
        const diffTime = now.getTime() - created.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      avgCompletionTime = totalDays / completedTasks.length;
    }

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      dueSoon,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate,
      avgCompletionTime,
    };
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return tasks
      .filter(t => t.status === 'done')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter(t => t.dueDate && t.status !== 'done')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);
  }, [tasks]);

  const priorityData = [
    { name: 'High', count: stats.highPriority, color: 'bg-red-500' },
    { name: 'Medium', count: stats.mediumPriority, color: 'bg-yellow-500' },
    { name: 'Low', count: stats.lowPriority, color: 'bg-green-500' },
  ];

  const statusData = [
    { name: 'To Do', count: stats.todo, color: 'bg-slate-500' },
    { name: 'In Progress', count: stats.inProgress, color: 'bg-blue-500' },
    { name: 'Done', count: stats.completed, color: 'bg-green-500' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Task Analytics & Insights
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[80vh]">
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <Target className="h-8 w-8 text-slate-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.completionRate.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Avg. Time</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.avgCompletionTime.toFixed(1)}d</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {(stats.overdue > 0 || stats.dueSoon > 0) && (
              <Card className="border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-700 dark:text-orange-300 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Attention Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.overdue > 0 && (
                      <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded">
                        <span className="text-sm text-red-700 dark:text-red-300">
                          {stats.overdue} overdue task{stats.overdue !== 1 ? 's' : ''}
                        </span>
                        <Badge variant="destructive">{stats.overdue}</Badge>
                      </div>
                    )}
                    {stats.dueSoon > 0 && (
                      <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                        <span className="text-sm text-orange-700 dark:text-orange-300">
                          {stats.dueSoon} task{stats.dueSoon !== 1 ? 's' : ''} due soon
                        </span>
                        <Badge variant="outline" className="border-orange-300">{stats.dueSoon}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statusData.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {item.count} ({stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{
                              width: stats.total > 0 ? `${(item.count / stats.total) * 100}%` : '0%'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Priority Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Priority Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {priorityData.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name} Priority</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {item.count} ({stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{
                              width: stats.total > 0 ? `${(item.count / stats.total) * 100}%` : '0%'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Upcoming Deadlines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recently Completed */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Recently Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTasks.length > 0 ? (
                    <div className="space-y-3">
                      {recentTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-2 rounded border">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{task.title}</p>
                            <p className="text-xs text-slate-500">
                              Completed • {new Date(task.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No completed tasks yet
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingDeadlines.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingDeadlines.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-2 rounded border">
                          <Clock className={`h-4 w-4 mt-0.5 ${
                            isOverdue(task) ? 'text-red-500' : 
                            isDueSoon(task, 3) ? 'text-orange-500' : 'text-slate-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{task.title}</p>
                            <p className="text-xs text-slate-500">
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                            </p>
                          </div>
                          <Badge 
                            variant={isOverdue(task) ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No upcoming deadlines
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Productivity Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Productivity Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Efficiency</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {stats.completionRate >= 80 ? "Excellent!" : 
                       stats.completionRate >= 60 ? "Good progress" : 
                       stats.completionRate >= 40 ? "Room for improvement" : "Need focus"}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-medium text-green-900 dark:text-green-100">Speed</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      {stats.avgCompletionTime <= 2 ? "Very fast" : 
                       stats.avgCompletionTime <= 5 ? "Good pace" : "Consider breaking down tasks"}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Focus</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      {stats.highPriority === 0 ? "No urgent tasks" : 
                       stats.highPriority <= 3 ? "Manageable workload" : "High pressure"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}