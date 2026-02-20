import { useState } from "react";
import { Task } from "@/types";
import { useTaskStore } from "@/stores/taskStore";
import { TaskFormDialog } from "./TaskFormDialog";
import { CheckCircle2, Circle, Pencil, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

export function TaskCard({ task }: { task: Task }) {
  const { updateTask, deleteTask } = useTaskStore();
  const [editOpen, setEditOpen] = useState(false);

  const toggleStatus = () => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    updateTask(task.id, { status: newStatus });
    toast.success(newStatus === "completed" ? "Task completed!" : "Task reopened");
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast.success("Task deleted");
  };

  return (
    <>
      <div className="glass-card-hover group flex items-start gap-4 p-4 animate-fade-in">
        <button
          onClick={toggleStatus}
          className="mt-0.5 shrink-0 transition-colors"
          aria-label="Toggle task status"
        >
          {task.status === "completed" ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "font-medium text-foreground",
              task.status === "completed" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {format(new Date(task.createdAt), "MMM d, yyyy")}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                task.status === "completed"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              )}
            >
              {task.status}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setEditOpen(true)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <TaskFormDialog open={editOpen} onOpenChange={setEditOpen} task={task} />
    </>
  );
}
