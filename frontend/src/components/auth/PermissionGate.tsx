import { useCasbin } from "../../hooks/useCasbin";

interface PermissionGateProps {
  object: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  object,
  action,
  children,
  fallback = <div className="text-red-500 p-2 text-sm">Access denied</div>,
  showLoading = true,
}) => {
  const { canAccess, loading } = useCasbin(object, action);
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
