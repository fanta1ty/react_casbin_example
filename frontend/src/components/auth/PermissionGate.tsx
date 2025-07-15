import React from "react";
import { useCasbin } from "../../hooks/useCasbin";

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
  // ✅ Add debug logging
  React.useEffect(() => {
    console.log(
      `PermissionGate: ${action} -> ${object} = ${canAccess} (loading: ${loading})`
    );
  }, [action, object, canAccess, loading]);

  if (loading && showLoading) {
    return (
      <div className="text-gray-500 p-2 text-sm">Checking permissions...</div>
    );
  }

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
