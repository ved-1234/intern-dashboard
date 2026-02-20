import { useEffect, useState } from "react";
import { useTaskStore } from "@/stores/taskStore";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

const statusFilters = [
  { label: "All", value: "all" as const },
  { label: "Pending", value: "pending" as const },
  { label: "Completed", value: "completed" as const },
];

const Tasks = () => {
  const {
    fetchTasks,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filteredTasks,
  } = useTaskStore();

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const tasks = filteredTasks();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground">Manage and track your work</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filterStatus === f.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5">
              <div className="h-5 w-1/3 skeleton-pulse mb-2" />
              <div className="h-4 w-2/3 skeleton-pulse" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
          <ListFilter className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium text-foreground">No tasks found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first task to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <TaskFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};

export default Tasks;
