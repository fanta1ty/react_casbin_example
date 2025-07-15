import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useCasbin = (object: string, action: string) => {
  const { user, checkPermission } = useAuth();
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setCanAccess(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const hasPermission = await checkPermission(object, action);
        setCanAccess(hasPermission);
      } catch (error) {
        console.error("Error checking permission:", error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [user, object, action, checkPermission]);
  return { canAccess, loading };
};
