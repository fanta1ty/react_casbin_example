import React from "react";
import { useCasbin } from "../../hooks/useCasbin";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface PermissionGateProps {
  action: string;
  object: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  action,
  object,
  children,
  fallback = <div className="text-red-500 p-2 text-sm">Access denied</div>,
  showLoading = true,
}) => {
  const { canAccess, loading } = useCasbin(action, object);

  if (loading && showLoading) {
    return <LoadingSpinner size="sm" text="Checking permissions..." />;
  }

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
