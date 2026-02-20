import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useAuthStore } from "@/stores/authStore";

const DashboardHome = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your tasks and activity.
        </p>
      </div>
      <DashboardStats />
    </div>
  );
};

export default DashboardHome;
