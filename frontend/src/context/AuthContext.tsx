import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CasbinContextType, CasbinPermission, User } from "../types/casbin";
import { casbinApi } from "../services/casbin";

const AuthContext = createContext<CasbinContextType | undefined>(undefined);

export const useAuth = (): CasbinContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<CasbinPermission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPermissions = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userPermissions = await casbinApi.getUserPermissions(user.username);
      setPermissions(userPermissions);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to fetch permission";
      setError(errorMessage);
      console.error("Error fetching permissions:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const checkPermission = async (
    object: string,
    action: string
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      const result = await casbinApi.enforcePermission({
        user: user.username,
        object,
        action,
      });
      return result.allowed;
    } catch (err) {
      console.error("Error checking permission:", err);
      return false;
    }
  };

  const handleSetUer = (newUser: User | null) => {
    setUser(newUser);
    setPermissions(null);
    setError(null);
  };

  useEffect(() => {
    if (user) {
      refreshPermissions();
    } else {
      setPermissions(null);
    }
  }, [user, refreshPermissions]);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loading,
        error,
        setUser: handleSetUer,
        checkPermission,
        refreshPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
