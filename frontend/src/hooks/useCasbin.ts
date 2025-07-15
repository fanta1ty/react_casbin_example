import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useCasbin = (object: string, action: string) => {
  const { user, can } = useAuth();
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
        const hasPermission = await can(object, action);
        setCanAccess(hasPermission);
      } catch (error) {
        console.error("Error checking permission:", error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [user, object, action, can]);
  return { canAccess, loading };
};

export const useCasbinCannot = (action: string, object: string) => {
  const { user, cannot } = useAuth();
  const [cannotAccess, setCannotAccess] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setCannotAccess(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const hasNoPermission = await cannot(action, object);
        setCannotAccess(hasNoPermission);
      } catch (error) {
        console.error("Error checking permission:", error);
        setCannotAccess(true);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, action, object, cannot]);

  return { cannotAccess, loading };
};
