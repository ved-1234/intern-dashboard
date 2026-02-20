import { useEffect } from "react";
import { useTaskStore } from "@/stores/taskStore";
import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";

export function DashboardStats() {
  const { tasks, fetchTasks, isLoading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: totalTasks, icon: ListTodo, color: "text-primary" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-success" },
    { label: "Pending", value: pending, icon: Clock, color: "text-warning" },
    { label: "Completion", value: `${completionRate}%`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card p-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          {isLoading ? (
            <div className="mt-2 h-8 w-16 skeleton-pulse" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
