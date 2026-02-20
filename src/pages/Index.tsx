import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const Index = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
