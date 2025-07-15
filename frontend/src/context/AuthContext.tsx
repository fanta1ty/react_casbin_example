import React, { createContext, useContext, useEffect, useState } from "react";
import { CasbinContextType, CasbinJsPermissions, User } from "../types/casbin";
import { Authorizer } from "casbin.js";

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
  mode = "auto",
  apiEndpoint = "http://localhost:5001/api/casbin",
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authorizer, setAuthorizer] = useState<Authorizer | null>(null);
  const [permissions, setPermissions] = useState<CasbinJsPermissions | null>(
    null
  );
  const [loading, setLoading] = useState(true); // ✅ Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false); // ✅ Track initialization

  // Initialize authorizer on mount
  useEffect(() => {
    const initializeAuthorizer = async () => {
      try {
        console.log("Initializing Casbin authorizer...");

        let authorizerInstance: Authorizer;

        if (mode === "auto") {
          authorizerInstance = new Authorizer("auto", {
            endpoint: apiEndpoint,
          });
        } else {
          authorizerInstance = new Authorizer("manual");
        }

        setAuthorizer(authorizerInstance);
        setInitialized(true);
        console.log("Casbin authorizer initialized successfully");
      } catch (err) {
        console.error("Failed to initialize authorizer:", err);
        setError("Failed to initialize authorization system");
      } finally {
        setLoading(false);
      }
    };

    initializeAuthorizer();
  }, [mode, apiEndpoint]);

  // Set user and fetch permissions
  const handleSetUser = async (newUser: User | null) => {
    if (!initialized || !authorizer) {
      console.warn("Trying to set user before authorizer is initialized");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (newUser) {
        console.log("Setting user in authorizer:", newUser.username);
        await authorizer.setUser(newUser.username);

        // If manual mode, fetch permissions from our API and set them
        if (mode === "manual") {
          await fetchAndSetPermissions(newUser.username);
        }

        setUser(newUser);
        console.log("User set successfully");
      } else {
        // Clear user
        setUser(null);
        setPermissions(null);
        // Note: casbin.js doesn't have a clear method, so we reinitialize
        if (mode === "manual") {
          const newAuthorizerInstance = new Authorizer("manual");
          setAuthorizer(newAuthorizerInstance);
        }
      }
    } catch (err: any) {
      console.error("Error setting user:", err);
      setError(err.message || "Failed to set user");
    } finally {
      setLoading(false);
    }
  };

  // Fetch permissions for manual mode
  const fetchAndSetPermissions = async (username: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/casbin/${username}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch permissions");
      }

      const fetchedPermissions = await response.json();
      setPermissions(fetchedPermissions);

      // Set permissions in casbin.js authorizer (manual mode)
      if (authorizer) {
        authorizer.setPermission(fetchedPermissions);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      throw err;
    }
  };

  // ✅ Safe permission checking
  const can = async (action: string, object: string): Promise<boolean> => {
    if (!initialized || !authorizer || !user) {
      console.warn("Cannot check permission: authorizer not ready or no user");
      return false;
    }

    try {
      const result = await authorizer.can(action, object);
      return result;
    } catch (err) {
      console.error("Error checking permission:", err);
      return false;
    }
  };

  // ✅ Safe negative permission checking
  const cannot = async (action: string, object: string): Promise<boolean> => {
    if (!initialized || !authorizer || !user) {
      console.warn(
        "Cannot check negative permission: authorizer not ready or no user"
      );
      return true;
    }

    try {
      const result = await authorizer.cannot(action, object);
      return result;
    } catch (err) {
      console.error("Error checking negative permission:", err);
      return true;
    }
  };

  // Refresh permissions
  const refreshPermissions = async () => {
    if (!user || !initialized || !authorizer) return;

    setLoading(true);
    try {
      if (mode === "auto") {
        await authorizer.setUser(user.username);
      } else {
        await fetchAndSetPermissions(user.username);
      }
    } catch (err: any) {
      setError(err.message || "Failed to refresh permissions");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setPermissions(null);
    setError(null);

    // Reinitialize authorizer for clean slate
    if (mode === "manual" && initialized) {
      const newAuthorizerInstance = new Authorizer("manual");
      setAuthorizer(newAuthorizerInstance);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authorizer,
        permissions,
        loading,
        error,
        initialized,
        setUser: handleSetUser,
        logout,
        can,
        cannot,
        refreshPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
