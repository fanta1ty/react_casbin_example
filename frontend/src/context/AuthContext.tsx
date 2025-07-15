import React, { createContext, useContext, useState, useEffect } from "react";
import { User, CasbinJsPermissions, CasbinContextType } from "../types";

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
  mode?: "auto" | "manual";
  apiEndpoint?: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  mode = "manual",
  apiEndpoint = "http://localhost:5001/api/casbin",
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<CasbinJsPermissions | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(true);

  // Mock permission checking for now
  const can = async (action: string, object: string): Promise<boolean> => {
    if (!user) return false;

    // Simple mock logic - admin can do everything
    if (user.roles.includes("admin")) return true;

    // Manager can read most things
    if (user.roles.includes("manager") && action === "read") return true;

    // User can only read dashboard and profile
    if (user.roles.includes("user")) {
      return (
        action === "read" && (object === "dashboard" || object === "profile")
      );
    }

    return false;
  };

  const handleSetUser = async (newUser: User | null) => {
    setLoading(true);
    setError(null);

    try {
      if (newUser) {
        // Mock fetching permissions
        const mockPermissions: CasbinJsPermissions = {
          read: ["dashboard", "profile"],
          write: newUser.roles.includes("admin") ? ["users", "roles"] : [],
        };

        setPermissions(mockPermissions);
        setUser(newUser);
      } else {
        setUser(null);
        setPermissions(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to set user");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setPermissions(null);
    setError(null);
  };

  const refreshPermissions = async () => {
    // Will implement in Part 2
    console.log("Refreshing permissions...");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loading,
        error,
        initialized,
        setUser: handleSetUser,
        logout,
        can,
        refreshPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
