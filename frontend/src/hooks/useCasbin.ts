import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useCasbin = (action: string, object: string) => {
  const { user, can, initialized, loading: authLoading } = useAuth();
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!initialized || authLoading) {
        setLoading(true);
        return;
      }

      if (!user) {
        setCanAccess(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const hasPermission = await can(action, object);
        setCanAccess(hasPermission);
      } catch (error) {
        console.error("Error checking permission:", error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, action, object, can, initialized, authLoading]);

  return { canAccess, loading };
};
