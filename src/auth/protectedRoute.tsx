// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";
import type { ProtectedRouteProps } from "@/interfaces/protectedRoute.interface";

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
